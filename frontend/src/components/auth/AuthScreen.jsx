import LoginForms from './LoginForms';

export default function AuthScreen() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#051a2c] p-4 overflow-hidden">
      <div className="w-full max-w-[440px] bg-[#0b2842]/40 backdrop-blur-md p-10 rounded-[40px] border border-white/5 shadow-2xl flex flex-col items-center animate-fade-in">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-4">
          <div className="w-48 h-48 flex items-center justify-center">
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
        
          </h1>
          <p className="text-sm text-gray-400">
           
          </p>
        </div>

        <LoginForms />

    </div>

	</div>
  );
}
