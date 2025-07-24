export function FooterLogo() {
  return (
    <div className="w-full py-8 text-center bg-gray-100 border-t">
      <a 
        href="https://sandpix.com" 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800"
      >
        <span className="text-sm">Made with</span>
        <img src="/sandpix-logo.svg" alt="SANDPIX" className="h-6" />
      </a>
    </div>
  );
}