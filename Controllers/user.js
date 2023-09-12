// userController.js

const User = require('../models/user'); // Impor model User atau sesuaikan dengan model yang Anda gunakan


exports.createUser = (req, res) => {
  const { name, email } = req.body;

  // Check if a user with the same name already exists
  User.findOne({ name })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(400).json({ message: 'Name has already been used' });
      }

      const newUser = new User({
        name: name,
        email: email,
        cart: { items: [] }
      });

      return newUser.save();
    })
    .then((user) => {
      return res.status(201).json(user);
    })
    .catch(error => console.log(error))
};

const bcrypt = require('bcrypt');


// exports.createUser = (req, res) => {
//   const { name, email, password } = req.body;

//   // Check if a user with the same name already exists
//   User.findOne({ name })
//     .then((existingUser) => {
//       if (existingUser) {
//         return res.status(400).json({ message: 'Name has already been used' });
//       }

//       // Hash the password before saving it to the database
//       bcrypt.hash(password, 10, (err, hashedPassword) => {
//         if (err) {
//           return res.status(500).json({ message: 'Password hashing failed' });
//         }

//         const newUser = new User({
//           name: name,
//           email: email,
//           password: hashedPassword, // Simpan password yang telah di-hash
//           cart: { items: [] }
//         });

//         return newUser.save()
//           .then((user) => {
//             return res.status(201).json(user);
//           })
//           .catch(error => console.log(error));
//       });
//     })
//     .catch(error => console.log(error));
// };

// userController.js

exports.getAllUsers = (req, res) => {
  // Mengambil semua user dari database
  User.find()
    .then((users) => {
      return res.status(200).json(users); // Mengirimkan daftar semua user dalam respons
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({ message: 'Server error' }); // Menangani kesalahan server
    });
};
