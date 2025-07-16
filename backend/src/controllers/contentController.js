const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 // 10MB default
  },
  fileFilter: (req, file, cb) => {
    // Allow images, videos, and documents
    const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|avi|mov|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images, videos, and documents are allowed'));
    }
  }
});

// Mock content library data
let mockContent = [
  {
    id: '1',
    name: 'hero-image.jpg',
    type: 'image',
    size: '2.4 MB',
    uploaded: '2024-01-15T10:30:00Z',
    url: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400',
    usedIn: ['Getting Started with React', 'Advanced React Patterns']
  },
  {
    id: '2',
    name: 'code-example.png',
    type: 'image',
    size: '890 KB',
    uploaded: '2024-01-13T09:20:00Z',
    url: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400',
    usedIn: ['JavaScript Best Practices']
  },
  {
    id: '3',
    name: 'ui-mockup.jpg',
    type: 'image',
    size: '3.1 MB',
    uploaded: '2024-01-11T11:00:00Z',
    url: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400',
    usedIn: ['UI Design Principles']
  }
];

const uploadFile = async (req, res) => {
  try {
    upload.single('file')(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      // Create file record
      const fileRecord = {
        id: Date.now().toString(),
        name: req.file.originalname,
        type: req.file.mimetype.startsWith('image/') ? 'image' : 
              req.file.mimetype.startsWith('video/') ? 'video' : 'document',
        size: formatFileSize(req.file.size),
        uploaded: new Date().toISOString(),
        url: `/uploads/${req.file.filename}`,
        usedIn: []
      };

      // Add to mock content library
      mockContent.push(fileRecord);

      console.log('📁 File uploaded:', fileRecord.name);

      res.status(201).json({
        success: true,
        message: 'File uploaded successfully',
        data: fileRecord
      });
    });

  } catch (error) {
    console.error('Upload file error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload file',
      error: error.message
    });
  }
};

const getContent = async (req, res) => {
  try {
    const { type, search } = req.query;
    let content = [...mockContent];

    // Apply type filter
    if (type && type !== 'all') {
      content = content.filter(item => item.type === type);
    }

    // Apply search filter
    if (search) {
      content = content.filter(item => 
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.json({
      success: true,
      data: content
    });

  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch content',
      error: error.message
    });
  }
};

const deleteContent = async (req, res) => {
  try {
    const { contentId } = req.params;
    
    // Find and remove from mock content
    const index = mockContent.findIndex(item => item.id === contentId);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    const deletedItem = mockContent.splice(index, 1)[0];
    
    // In production, also delete the actual file
    // const filePath = path.join(__dirname, '../../uploads', path.basename(deletedItem.url));
    // if (fs.existsSync(filePath)) {
    //   fs.unlinkSync(filePath);
    // }

    console.log('🗑️  Content deleted:', deletedItem.name);

    res.json({
      success: true,
      message: 'Content deleted successfully'
    });

  } catch (error) {
    console.error('Delete content error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete content',
      error: error.message
    });
  }
};

// Helper function to format file size
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

module.exports = {
  uploadFile,
  getContent,
  deleteContent
};