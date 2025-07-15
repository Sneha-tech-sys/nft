import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAccount } from "wagmi";
import { ConnectKitButton } from "connectkit";
import {
  Edit3,
  LogOut,
  Copy,
  Check,
  Link as LinkIcon,
  ExternalLink,
  Twitter,
  Globe,
  Wallet,
  Gift,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNFT } from "../contexts/NFTContext";
import { useReferral } from "../contexts/ReferralContext";
import { NFT } from "../types";
import NFTCard from "../components/NFTCard";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { user, isAuthenticated, login, updateProfile } = useAuth();
  const { nfts: allNFTs, fetchNFTs } = useNFT();
  const {
    referralCode,
    referralLink,
    referralEarnings,
    referralCount,
    generateReferralCode,
  } = useReferral();

  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [twitter, setTwitter] = useState("");
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [activeTab, setActiveTab] = useState("created");
  const [isLoading, setIsLoading] = useState(true);
  const [isReferralCopied, setIsReferralCopied] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (!isConnected) {
        setIsLoading(false);
        return;
      }

      // Try to authenticate if connected but not authenticated
      if (isConnected && !isAuthenticated) {
        await login();
      }

      // Load user data
      if (user) {
        setUsername(user.username || "");
        setBio(user.bio || "");
        setWebsite(user.website || "");
        setTwitter(user.twitter || "");
      }

      // Generate referral code if needed
      if (!referralCode) {
        await generateReferralCode();
      }

      // Load user NFTs
      const fetchedNFTs = await fetchNFTs();

      // Filter for owned and created NFTs
      if (address) {
        const createdNFTs = fetchedNFTs.filter(
          (nft) => nft.creator.username === user?.username
        );

        const ownedNFTs = fetchedNFTs.filter(
          (nft) => nft.owner.username === user?.username
        );

        setNfts(activeTab === "created" ? createdNFTs : ownedNFTs);
      }

      setIsLoading(false);
    };

    loadProfile();
  }, [
    isConnected,
    isAuthenticated,
    user,
    address,
    activeTab,
    login,
    fetchNFTs,
    generateReferralCode,
    referralCode,
  ]);

  const handleSaveProfile = () => {
    if (user) {
      updateProfile({
        ...user,
        username,
        bio,
        website,
        twitter,
      });

      setIsEditing(false);
    }
  };

  const copyReferralLink = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink);
      setIsReferralCopied(true);

      setTimeout(() => {
        setIsReferralCopied(false);
      }, 3000);
    }
  };

  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="fade-in pt-7">
      {isConnected && isAuthenticated ? (
        <>
          {/* Profile Header */}
          <div className="relative">
            {/* Profile Banner */}
            <div className="h-32 sm:h-48 bg-gradient-to-r from-deepGreen via-primary to-golden rounded-xl relative overflow-hidden glow-effect">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            </div>

            {/* Profile Picture & Info */}
            <div className="relative z-10 -mt-12 sm:-mt-16 px-4 sm:px-6 sm:flex sm:items-end sm:justify-between">
              <div className="sm:flex sm:space-x-5">
                <div className="relative">
                  <img
                    src={user?.avatar || "https://via.placeholder.com/150"}
                    alt={user?.username || "User"}
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-darkGray bg-white dark:bg-darkGray glow-effect"
                  />
                  {user?.isVerified && (
                    <div className="absolute bottom-1 right-1 bg-golden text-trueBlack p-1 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 sm:h-4 sm:w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="mt-4 sm:mt-0 sm:pt-1 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                      {user?.username || "Anonymous User"}
                    </h1>
                    {user?.isVerified && (
                      <span className="mt-1 sm:mt-0 sm:ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-golden/20 text-golden">
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {formatAddress(address || "")}
                    <button
                      onClick={() =>
                        address && navigator.clipboard.writeText(address)
                      }
                      className="ml-2 text-gray-500 hover:text-golden dark:text-gray-400 dark:hover:text-golden-light transition-colors"
                      title="Copy address"
                    >
                      <Copy size={12} />
                    </button>
                  </p>
                  <p className="mt-1 max-w-2xl text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    {user?.bio || "No bio provided"}
                  </p>
                </div>
              </div>
              <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center justify-center px-3 sm:px-4 py-2 border border-gray-300 dark:border-charcoal rounded-md shadow-sm text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-darkGray hover:bg-gray-50 dark:hover:bg-charcoal focus:outline-none glow-effect"
                >
                  <Edit3 size={14} className="mr-2" />
                  Edit Profile
                </button>
                <button
                  onClick={() => navigate("/mint")}
                  className="btn-primary px-3 sm:px-4 py-2 text-xs sm:text-sm"
                >
                  Create NFT
                </button>
              </div>
            </div>
          </div>

          {/* Edit Profile Modal */}
          {isEditing && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-trueBlack/50 flex items-center justify-center p-4">
              <div className="cyber-card bg-white dark:bg-darkGray rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto glow-effect">
                <h2 className="text-xl font-bold mb-4 dark:text-white">
                  Edit Profile
                </h2>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="input-field mt-1"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="bio"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="input-field mt-1 resize-none"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="website"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Website
                    </label>
                    <input
                      type="url"
                      id="website"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="input-field mt-1"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="twitter"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Twitter
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-charcoal bg-gray-50 dark:bg-charcoal text-gray-500 dark:text-gray-400 text-sm">
                        @
                      </span>
                      <input
                        type="text"
                        id="twitter"
                        value={twitter}
                        onChange={(e) => setTwitter(e.target.value)}
                        className="input-field rounded-none rounded-r-md"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-charcoal rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-darkGray hover:bg-gray-50 dark:hover:bg-charcoal focus:outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="btn-primary px-4 py-2 text-sm"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="mb-6 border-b border-gray-200 dark:border-charcoal">
                <nav className="-mb-px flex space-x-6 sm:space-x-8 overflow-x-auto">
                  <button
                    onClick={() => setActiveTab("created")}
                    className={`
                      py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-300
                      ${
                        activeTab === "created"
                          ? "border-golden text-golden glow-effect"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-charcoal hover:glow-effect"
                      }
                    `}
                  >
                    Created
                  </button>
                  <button
                    onClick={() => setActiveTab("owned")}
                    className={`
                      py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-300
                      ${
                        activeTab === "owned"
                          ? "border-golden text-golden glow-effect"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-charcoal hover:glow-effect"
                      }
                    `}
                  >
                    Owned
                  </button>
                </nav>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {Array(4)
                    .fill(null)
                    .map((_, index) => (
                      <div
                        key={index}
                        className="card animate-pulse loading-pulse"
                      >
                        <div className="w-full h-48 sm:h-64 bg-gray-300 dark:bg-charcoal rounded-t-xl"></div>
                        <div className="p-4">
                          <div className="h-4 bg-gray-300 dark:bg-charcoal rounded w-3/4 mb-2"></div>
                          <div className="h-4 bg-gray-300 dark:bg-charcoal rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : nfts.length === 0 ? (
                <div className="text-center py-12 cyber-card rounded-xl glow-effect">
                  <div className="text-4xl sm:text-6xl mb-4">🌱</div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 dark:text-white">
                    {activeTab === "created"
                      ? "You haven't created any NFTs yet"
                      : "You don't own any NFTs yet"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm sm:text-base">
                    {activeTab === "created"
                      ? "Start your journey as a creator and mint your first NFT"
                      : "Explore the marketplace and find NFTs that speak to you"}
                  </p>
                  <Link
                    to={activeTab === "created" ? "/mint" : "/explore"}
                    className="btn-primary glow-effect"
                  >
                    {activeTab === "created" ? "Create NFT" : "Explore NFTs"}
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {nfts.map((nft) => (
                    <NFTCard key={nft.id} nft={nft} />
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Social Links */}
              <div className="cyber-card p-4 sm:p-6">
                <h3 className="font-bold text-lg mb-4 dark:text-white">
                  Social Links
                </h3>
                <ul className="space-y-4">
                  {website && (
                    <li className="flex items-center">
                      <Globe
                        size={16}
                        className="mr-2 text-gray-500 dark:text-gray-400"
                      />
                      <a
                        href={
                          website.startsWith("http")
                            ? website
                            : `https://${website}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-golden hover:text-golden-dark flex items-center text-sm transition-colors glow-effect"
                      >
                        {website.replace(/^https?:\/\//, "")}
                        <ExternalLink size={12} className="ml-1" />
                      </a>
                    </li>
                  )}
                  {twitter && (
                    <li className="flex items-center">
                      <Twitter
                        size={16}
                        className="mr-2 text-gray-500 dark:text-gray-400"
                      />
                      <a
                        href={`https://twitter.com/${twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-golden hover:text-golden-dark flex items-center text-sm transition-colors glow-effect"
                      >
                        @{twitter}
                        <ExternalLink size={12} className="ml-1" />
                      </a>
                    </li>
                  )}
                  {!website && !twitter && (
                    <li className="text-gray-500 dark:text-gray-400 text-sm">
                      No social links added yet.
                    </li>
                  )}
                </ul>
              </div>

              {/* Wallet */}
              <div className="cyber-card p-4 sm:p-6">
                <h3 className="font-bold text-lg mb-4 dark:text-white">
                  Wallet
                </h3>
                <div className="flex items-center mb-4">
                  <Wallet
                    size={16}
                    className="mr-2 text-gray-500 dark:text-gray-400"
                  />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">
                    {formatAddress(address || "")}
                  </span>
                  <button
                    onClick={() =>
                      address && navigator.clipboard.writeText(address)
                    }
                    className="ml-2 text-gray-500 hover:text-golden dark:text-gray-400 dark:hover:text-golden-light transition-colors"
                    title="Copy address"
                  >
                    <Copy size={12} />
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-t border-gray-200 dark:border-charcoal">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">
                      Balance:
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white text-sm">
                      0.0 ETH
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-t border-gray-200 dark:border-charcoal">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">
                      AMMYI Balance:
                    </span>
                    <span className="font-semibold text-golden text-sm">
                      0.0 AMMYI
                    </span>
                  </div>
                </div>
              </div>

              {/* Referral Program */}
              <div className="cyber-card p-4 sm:p-6">
                <h3 className="font-bold text-lg mb-4 dark:text-white">
                  Referral Program
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Share your referral link and earn 5% of all sales from users
                  who sign up using your link.
                </p>
                {referralLink ? (
                  <>
                    <div className="cyber-card bg-gray-100 dark:bg-charcoal p-3 rounded-lg mb-4 flex justify-between items-center">
                      <div className="text-gray-700 dark:text-gray-300 text-xs truncate mr-2">
                        {referralLink}
                      </div>
                      <button
                        onClick={copyReferralLink}
                        className="text-golden hover:text-golden-dark transition-colors"
                        title="Copy referral link"
                      >
                        {isReferralCopied ? (
                          <Check size={16} />
                        ) : (
                          <Copy size={16} />
                        )}
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="cyber-card bg-gradient-to-br from-primary-light/10 to-golden/10 dark:from-primary-dark/20 dark:to-golden-dark/20 p-3 rounded-lg">
                        <p className="text-xs text-primary dark:text-primary-light">
                          Total Earnings
                        </p>
                        <p className="text-lg font-bold text-primary-dark dark:text-primary-light">
                          {referralEarnings} AMMYI
                        </p>
                      </div>
                      <div className="cyber-card bg-gradient-to-br from-golden/10 to-golden-dark/10 dark:from-golden-light/20 dark:to-golden/20 p-3 rounded-lg">
                        <p className="text-xs text-golden">Referrals</p>
                        <p className="text-lg font-bold text-golden-dark dark:text-golden-light">
                          {referralCount}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <button
                    onClick={generateReferralCode}
                    className="btn-primary w-full text-sm glow-effect"
                  >
                    <LinkIcon size={14} className="mr-2" />
                    Generate Referral Link
                  </button>
                )}
              </div>

              {/* Lucky Draw */}
              <div className="cyber-card p-4 sm:p-6 bg-gradient-to-br from-golden/10 to-golden-dark/10 dark:from-golden-light/20 dark:to-golden/20">
                <h3 className="font-bold text-lg mb-4 text-golden-dark dark:text-golden-light flex items-center">
                  <Gift size={18} className="mr-2" />
                  Lucky Draw
                </h3>
                <p className="text-golden dark:text-golden-light text-sm mb-4">
                  Join our weekly lucky draw for a chance to win exclusive NFTs
                  and AMMYI tokens!
                </p>
                <Link
                  to="/lucky-draw"
                  className="btn-secondary w-full text-sm glow-effect"
                >
                  Enter Lucky Draw
                </Link>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 dark:text-white">
            Connect Your Wallet
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8 text-sm sm:text-base">
            Connect your wallet to view your profile, NFT collection, and
            participate in our marketplace.
          </p>
          <ConnectKitButton.Custom>
            {({ show }) => (
              <button onClick={show} className="btn-primary px-6 sm:px-8 py-3">
                Connect Wallet
              </button>
            )}
          </ConnectKitButton.Custom>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
