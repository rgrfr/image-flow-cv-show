
import { Button } from "@/components/ui/button";

const UploadInstructions = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-2xl mx-auto bg-gray-900 p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold mb-6">Upload Your Portfolio Images</h1>
        
        <div className="mb-8 text-left">
          <h2 className="text-xl font-semibold mb-3">Instructions:</h2>
          <ol className="list-decimal pl-5 space-y-3">
            <li>Add your portfolio images to the <code className="bg-gray-800 px-2 py-1 rounded">/public/images</code> folder in your GitHub repository.</li>
            <li>Make sure your filenames follow the format: <code className="bg-gray-800 px-2 py-1 rounded">ClientName - ProjectDescription.jpg</code></li>
            <li>Images can be JPG, JPEG, or PNG formats.</li>
            <li>Reload the page after uploading your images.</li>
            <li>Use the "Configure Slides" button to select which images to show and in what order.</li>
          </ol>
        </div>
        
        <div className="text-amber-300 bg-amber-950/50 p-4 rounded-md mb-8">
          <p className="font-medium">Filename Example:</p>
          <p className="font-mono mt-1">Microsoft - Brochure Design for MS Office.jpg</p>
          <p className="mt-2 text-sm">This will display "Microsoft" as the title and "Brochure Design for MS Office" as the subtitle.</p>
        </div>
        
        <div className="text-green-300 bg-green-950/50 p-4 rounded-md mb-8">
          <p className="font-medium">Note About Image Loading:</p>
          <p className="mt-1">
            The app uses a client-side approach to find images. If your images don't appear after refreshing,
            make sure they are in the correct location and your repository is properly configured.
          </p>
        </div>
        
        <Button className="bg-white text-black hover:bg-gray-200">
          <a href="/" className="block">Reload After Uploading Images</a>
        </Button>
      </div>
    </div>
  );
};

export default UploadInstructions;
