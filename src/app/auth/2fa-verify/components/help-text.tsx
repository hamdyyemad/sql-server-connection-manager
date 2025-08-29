const HelpText = () => {
  return (
    <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
      <h3 className="text-sm font-medium text-blue-300 mb-2">Need help?</h3>
      <p className="text-xs text-gray-400">
        Open your authenticator app and enter the 6-digit code that appears.
        The code refreshes every 30 seconds.
      </p>
    </div>
  );
};

HelpText.displayName = "HelpText";

export default HelpText;
