"use client";

/**
 * SidenavToggle - A simple toggle button for the mobile sidenav.
 *
 * Toggles the `-translate-x-full` class on the sidenav element to show/hide it
 * on small screens. Renders a hamburger menu icon.
 */
const SidenavToggle = () => {
  const toggleSidenav = () => {
    const sidenav = document.getElementById("sidenav");
    if (sidenav) {
      sidenav.classList.toggle("-translate-x-full");
    }
  };

  return (
    <button
      className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
      onClick={toggleSidenav}
      aria-label="Toggle menu"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>
  );
};

export default SidenavToggle;
