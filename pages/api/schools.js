// import formidable from 'formidable';
// import fs from 'fs';
// import path from 'path';
// import { v4 as uuidv4 } from 'uuid';
// import pool from '../../lib/db';

// export const config = {
//   api: {
//     bodyParser: false, // important for formidable
//   },
// };

// export default async function handler(req, res) {
//   if (req.method === 'GET') {
//     try {
//       const [rows] = await pool.query('SELECT id, name, address, city, state, contact, image, email_id FROM schools ORDER BY id DESC');
//       return res.status(200).json({ success: true, data: rows });
//     } catch (err) {
//       console.error('DB GET error', err);
//       return res.status(500).json({ success: false, error: 'Database error' });
//     }
//   }

//   if (req.method === 'POST') {
    
//     const uploadDir = path.join(process.cwd(), 'public', 'schoolImages');
//     await fs.promises.mkdir(uploadDir, { recursive: true });

//     const form = formidable({
//       multiples: false,
//       uploadDir,         
//       keepExtensions: true,
//     });

//     form.parse(req, async (err, fields, files) => {
//       if (err) {
//         console.error('Form parse error', err);
//         return res.status(500).json({ success: false, error: 'Form parse error' });
//       }
       
//       console.log('FIELDS:', fields);
//       console.log('FILES:', files);


//       try {
//          const name = (fields.name?.[0] || '').trim();
//          const address = (fields.address?.[0] || '').trim();
//          const city = (fields.city?.[0] || '').trim();
//          const state = (fields.state?.[0] || '').trim();
//          const email_id = (fields.email_id?.[0] || '').trim();
//          const contact = fields.contact?.[0] ? Number(fields.contact[0]) : null;


//         // Basic server-side validation
//         if (!name || !address || !city || !state || !email_id) {
//           return res.status(400).json({ success: false, error: 'Missing required fields' });
//         }
//         if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email_id)) {
//           return res.status(400).json({ success: false, error: 'Invalid email' });
//         }

//         let imagePath = null;
//         if (files.image) {
        
//           const file = Array.isArray(files.image) ? files.image[0] : files.image;
//           const oldPath = file.filepath || file.path;
//           const origName = file.originalFilename || file.name || 'upload';
//           const ext = path.extname(origName) || path.extname(oldPath) || '.jpg';
//           const fileName = uuidv4() + ext;
//           const newPath = path.join(uploadDir, fileName);

      
//           await fs.promises.rename(oldPath, newPath);
//           imagePath = `/schoolImages/${fileName}`;
//         }

      
//         const sql = 'INSERT INTO schools (name, address, city, state, contact, image, email_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
//         const [result] = await pool.query(sql, [name, address, city, state, contact, imagePath, email_id]);

//         return res.status(200).json({ success: true, id: result.insertId });
//       } catch (e) {
//         console.error('POST handler error', e);
//         return res.status(500).json({ success: false, error: 'Server error' });
//       }
//     });

//     return; 
//   }

//   res.setHeader('Allow', ['GET', 'POST']);
//   res.status(405).end(`Method ${req.method} Not Allowed`);
// }


import formidable from 'formidable';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import pool from '../../lib/db';
import { v4 as uuidv4 } from 'uuid';

export const config = {
  api: {
    bodyParser: false, 
  },
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query(
        'SELECT id, name, address, city, state, contact, image, email_id FROM schools ORDER BY id DESC'
      );
      return res.status(200).json({ success: true, data: rows });
    } catch (err) {
      console.error('DB GET error', err);
      return res.status(500).json({ success: false, error: 'Database error' });
    }
  }

  if (req.method === 'POST') {
    const form = formidable({ multiples: false });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Form parse error', err);
        return res.status(500).json({ success: false, error: 'Form parse error' });
      }

      try {
        const name = (fields.name?.[0] || '').trim();
        const address = (fields.address?.[0] || '').trim();
        const city = (fields.city?.[0] || '').trim();
        const state = (fields.state?.[0] || '').trim();
        const email_id = (fields.email_id?.[0] || '').trim();
        const contact = fields.contact?.[0] ? Number(fields.contact[0]) : null;

        // Basic validation
        if (!name || !address || !city || !state || !email_id) {
          return res.status(400).json({ success: false, error: 'Missing required fields' });
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email_id)) {
          return res.status(400).json({ success: false, error: 'Invalid email' });
        }

        let imagePath = null;

        if (files.image) {
          const file = Array.isArray(files.image) ? files.image[0] : files.image;
          const uploadResult = await cloudinary.uploader.upload(file.filepath, {
            folder: 'schoolImages',
            public_id: uuidv4(),
          });
          imagePath = uploadResult.secure_url; // Cloudinary URL
        }

        const sql =
          'INSERT INTO schools (name, address, city, state, contact, image, email_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const [result] = await pool.query(sql, [
          name,
          address,
          city,
          state,
          contact,
          imagePath,
          email_id,
        ]);

        return res.status(200).json({ success: true, id: result.insertId });
      } catch (e) {
        console.error('POST handler error', e);
        return res.status(500).json({ success: false, error: 'Server error' });
      }
    });

    return;
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
