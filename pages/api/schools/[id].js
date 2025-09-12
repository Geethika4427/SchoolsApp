import pool from '../../../lib/db';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false, 
  },
};

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    try {
      const form = formidable({ multiples: false, uploadDir: './public/uploads', keepExtensions: true });

      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error('Formidable error:', err);
          return res.status(500).json({ success: false, error: 'Form parse failed' });
        }

        const { name, email_id, contact, address, city, state } = fields;
        let imagePath = null;

        if (files.image) {
          const oldPath = files.image.filepath;
          const newFileName = Date.now() + '-' + files.image.originalFilename;
          const newPath = path.join(process.cwd(), 'public/uploads', newFileName);

          fs.renameSync(oldPath, newPath);
          imagePath = '/uploads/' + newFileName;
        }

        try {
          let query = `
            UPDATE schools 
            SET name=?, email_id=?, contact=?, address=?, city=?, state=? ${imagePath ? ', image=?' : ''} 
            WHERE id=?`;

          let params = [name, email_id, contact, address, city, state];
          if (imagePath) params.push(imagePath);
          params.push(id);

          await pool.query(query, params);

          return res.status(200).json({ success: true });
        } catch (dbErr) {
          console.error('DB update error:', dbErr);
          return res.status(500).json({ success: false, error: 'Database error' });
        }
      });
    } catch (err) {
      console.error('Unexpected error:', err);
      return res.status(500).json({ success: false, error: 'Unexpected error' });
    }
  }

  else if (req.method === 'DELETE') {
    try {
      await pool.query('DELETE FROM schools WHERE id=?', [id]);
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error('Delete error:', err);
      return res.status(500).json({ success: false, error: 'Database error' });
    }
  }

  else {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
