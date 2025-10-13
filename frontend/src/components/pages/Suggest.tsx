import { useState } from 'react';
// import { suggests, type Suggest } from '../../data/Suggest';


export default function Suggest() {
    const [suggestion, setSuggestion] = useState("");
    const [email, setEmail] = useState("");
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log("Suggestion:", suggestion);
      console.log("Email:", email);
      // Here you can send data to your backend or API
    };
  
    return (
        <div className="min-h-screen bg-gray-50">
         {/* Hero Section */}
         <section className="bg-gradient-to-b from-brand-600 to-brand-500 text-white py-10">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center animate-fadeIn">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                شارك اقتراحك
              </h1>
              <p className="text-lg md:text-xl text-brand-100 max-w-2xl mx-auto">
              شاركنا أفكارك لمبادرات تكافلية جديدة يمكن أن تُحدث أثرًا إيجابيًا في المجتمع💡             </p>
            </div>
          </div>
        </section>
        <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto mt-5 p-6 bg-white shadow-md rounded-2xl space-y-4"
    >

      {/* Suggestion Text Area */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="suggestion" className="text-gray-700 font-medium">
          اقتراحك:
        </label>
        <textarea
          id="suggestion"
          rows={5}
          value={suggestion}
          onChange={(e) => setSuggestion(e.target.value)}
          placeholder="هنا..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        />
      </div>

      {/* Email Input */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="email" className="text-gray-700 font-medium">
          بريدك الالكتروني
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@email.com"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-800
                   transition duration-200 font-medium"
      >
        Submit
      </button>
    </form>
        </div>
        
    );
}