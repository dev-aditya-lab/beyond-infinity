const SettingsView = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bebas text-brand-offwhite">Settings</h2>
      
      <div className="bg-brand-offwhite/5 border border-brand-offwhite/10 rounded-xl p-6">
        <h3 className="text-lg font-bebas text-brand-offwhite mb-4">Account Settings</h3>
        <div className="space-y-4">
          <div className="flex-between">
            <div>
              <p className="text-brand-offwhite font-barlow">Email Notifications</p>
              <p className="text-brand-offwhite/60 text-sm">Receive email alerts for API issues</p>
            </div>
            <button className="w-12 h-6 bg-brand-offwhite/20 rounded-full relative">
              <div className="w-5 h-5 bg-brand-offwhite rounded-full absolute left-0.5 top-0.5"></div>
            </button>
          </div>
          
          <div className="flex-between">
            <div>
              <p className="text-brand-offwhite font-barlow">Data Retention</p>
              <p className="text-brand-offwhite/60 text-sm">Keep logs and analytics data for</p>
            </div>
            <select className="bg-brand-offwhite/10 border border-brand-offwhite/20 rounded px-3 py-1 text-brand-offwhite">
              <option>30 days</option>
              <option>60 days</option>
              <option>90 days</option>
            </select>
          </div>
          
          <div className="flex-between">
            <div>
              <p className="text-brand-offwhite font-barlow">API Rate Limit</p>
              <p className="text-brand-offwhite/60 text-sm">Maximum requests per minute</p>
            </div>
            <input 
              type="number" 
              defaultValue="1000"
              className="bg-brand-offwhite/10 border border-brand-offwhite/20 rounded px-3 py-1 text-brand-offwhite w-24"
            />
          </div>
        </div>
      </div>
      
      <div className="bg-brand-offwhite/5 border border-brand-offwhite/10 rounded-xl p-6">
        <h3 className="text-lg font-bebas text-brand-offwhite mb-4">Security</h3>
        <div className="space-y-4">
          <button className="btn-ghost btn-ghost-sm w-full justify-start">
            CHANGE PASSWORD
          </button>
          <button className="btn-ghost btn-ghost-sm w-full justify-start">
            ENABLE TWO-FACTOR AUTH
          </button>
          <button className="btn-ghost btn-ghost-sm w-full justify-start text-red-400">
            DELETE ACCOUNT
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
