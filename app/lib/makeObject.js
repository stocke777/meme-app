const fs = require('fs');

// Function to get width and height of images (mock for demonstration)
const getImageDimensions = async (url) => {
  // Replace this function with actual logic to fetch image dimensions
  return { width: 1000, height: 800 }; // Example dimensions
};

// Read and clean URLs from the file
const processURLs = async (filePath) => {
  try {
    let data = fs.readFileSync(filePath, 'utf-16le');  // Read file as UTF-8
    // Remove BOM (Byte Order Mark) if present and clean up invisible characters
    data = data.replace(/^\uFEFF/, '');  // Removes BOM
    const urls = data.split('\n')
      .map((url) => url.trim())        // Trim spaces
      .filter((url) => url !== '');    // Filter out empty lines

    // Log each URL to verify correct reading
    console.log('URLs:', urls);

    const promises = urls.map(async (url) => {
      // Debug log the URL before processing
      console.log('Processing URL:', url);
      
      const { width, height } = await getImageDimensions(url);
      return {
        src: url,
        width,
        height,
      };
    });

    const result = await Promise.all(promises);
    console.log('Result:', result);
    fs.writeFileSync('./result.json', JSON.stringify(result, null, 2)); 
  } catch (error) {
    console.error('Error reading or processing file:', error);
  }
};

// Call the function with your text file path
processURLs('urls.txt');

// to get url list from s3 bucket
// aws s3 ls s3://your-bucket-name --recursive | ForEach-Object { if ($_ -match "\.(jpg|png|gif)$") { $key = ($_ -split "\s+")[-1]; "https://your-bucket-name.s3.amazonaws.com/$key" } } | Out-File -FilePath "C:\path\to\output\image-urls.txt"
