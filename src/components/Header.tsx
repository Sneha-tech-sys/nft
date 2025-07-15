import { useState } from "react";
import { Search, Menu, Sun, Moon, Bell, Gift, Leaf } from "lucide-react";
import { ConnectKitButton } from "connectkit";
import { useTheme } from "../contexts/ThemeContext";

const Header = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [hasNotifications, setHasNotifications] = useState(true);

  return (
    <header className="fixed w-full z-40 bg-white/95 dark:bg-gray-900 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-800 py-3 px-4">
      <div className="flex items-center justify-between">
        {/* Left side - Logo and Mobile Menu */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>

          <div className="hidden md:flex items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-golden to-golden-dark flex items-center justify-center mr-2">
              <Leaf size={18} className="text-trueBlack" />
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div className="flex-1 max-w-2xl mr-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search NFTs, collections, or accounts..."
              className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-lg leading-5 bg-gray-100 dark:bg-black/40 text-gray-700 dark:text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right side buttons */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <button
            className="p-2 relative rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-gray-700 dark:text-gray-300 group-hover:text-blue-500 transition-colors" />
            {hasNotifications && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-gray-900"></span>
            )}
          </button>

          {/* Special Offers */}
          <button
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
            aria-label="Special offers"
          >
            <Gift className="h-5 w-5 text-gray-700 dark:text-gray-300 group-hover:text-yellow-500 transition-colors" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-yellow-400 group-hover:rotate-12 transition-transform" />
            ) : (
              <Moon className="h-5 w-5 text-gray-700 group-hover:rotate-12 transition-transform" />
            )}
          </button>

          {/* Connect Wallet */}
          <ConnectKitButton.Custom>
            {({ isConnected, show }) => (
              <button
                onClick={show}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow-md flex items-center"
              >
                {isConnected ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
                    Connected
                  </>
                ) : (
                  "Connect Wallet"
                )}
              </button>
            )}
          </ConnectKitButton.Custom>
        </div>
      </div>
    </header>
  );
};

export default Header;
