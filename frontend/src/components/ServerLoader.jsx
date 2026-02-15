const ServerLoader = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-sky-50 via-white to-sky-100 z-50">
      
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-sky-200 border-t-sky-500 mb-6"></div>
      
      <h2 className="text-2xl font-bold text-sky-700 mb-2">
        Connecting to Server...
      </h2>
      
      <p className="text-sm text-slate-600 text-center max-w-xs">
        Please wait while we wake up the server.
        This may take a few seconds.
      </p>
    </div>
  );
};

export default ServerLoader;
