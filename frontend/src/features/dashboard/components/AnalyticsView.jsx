const AnalyticsView = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bebas text-brand-offwhite">Analytics Overview</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-brand-offwhite/5 border border-brand-offwhite/10 rounded-xl p-6">
          <h3 className="text-lg font-bebas text-brand-offwhite mb-4">Request Trends</h3>
          <div className="h-64 flex items-center justify-center text-brand-offwhite/40">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <p>Chart visualization would go here</p>
            </div>
          </div>
        </div>
        
        <div className="bg-brand-offwhite/5 border border-brand-offwhite/10 rounded-xl p-6">
          <h3 className="text-lg font-bebas text-brand-offwhite mb-4">Response Times</h3>
          <div className="h-64 flex items-center justify-center text-brand-offwhite/40">
            <div className="text-center">
              <div className="text-4xl mb-2">⚡</div>
              <p>Performance metrics would go here</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-brand-offwhite/5 border border-brand-offwhite/10 rounded-xl p-6">
        <h3 className="text-lg font-bebas text-brand-offwhite mb-4">Usage by Endpoint</h3>
        <div className="h-64 flex items-center justify-center text-brand-offwhite/40">
          <div className="text-center">
            <div className="text-4xl mb-2">📈</div>
            <p>Endpoint breakdown would go here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
