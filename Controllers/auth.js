// Import module yang dibutuhkan
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Import model User dan UserToken (asumsi model ini sudah didefinisikan di tempat lain)
const User = require("../models/user");
const UserToken = require("../models/UserToken");

// Logika registrasi pengguna
exports.signup = async (req, res, next) => {
  // Ekstrak data registrasi pengguna dari body permintaan
  const email = req.body.email;
  const name = req.body.name;
  const ps = req.body.password;

  console.log(req.body);

  // Membuat salt untuk meng-hash password
  const salt = await bcrypt.genSalt(Number(process.env.SALT))
  bcrypt.hash(ps, salt, function (err, hash) {
    if (err) {
      console.log(err);
    }

    // Membuat instance User baru dengan password yang di-hash
    const newUser = new User({
      email: email,
      password: hash,
      name: name,
    });
    newUser.save().then((result) => {
      res.json({
        message: "Pengguna berhasil registrasi",
        userId: result._id,
        password: result.password,
      });
    });
  });
};

// Logika login pengguna
exports.login = (req, res, next) => {
  // Ekstrak email dan password dari body permintaan
  const emailP = req.body.email;
  const pswd = req.body.password;
  console.log(`Ini adalah password Anda ${pswd}`);
  console.log(`Ini adalah email Anda ${emailP}`);
  
  let loggedUser;

  // Mencari pengguna berdasarkan email yang diberikan
  User.findOne({ email: emailP })
    .then((userFound) => {
      if (!userFound) {
        // Jika pengguna tidak ditemukan, kirim respons kesalahan
        const error = new Error("Pengguna dengan email tersebut tidak ditemukan");
        error.statusCode = 433;
        res.status(400).send({ message: error.message, status: "Gagal" });
      }

      loggedUser = userFound;

      // Membandingkan password yang diterima dengan password yang di-hash di database
      return bcrypt.compare(pswd, loggedUser.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        // Jika password tidak cocok, kirim respons kesalahan
        const error = new Error("Password salah");
        error.statusCode = 424;
        throw error;
      }

      // Jika password cocok, hasilkan token untuk pengguna
      generateTokens(loggedUser)
        .then((result) => {
          const { accessToken, refreshToken } = result;

          // Setelah token dihasilkan, atur cookie refresh token, header autorisasi, dan kirim respons
          res
            .cookie("refreshToken", refreshToken, {
              httpOnly: true,
              secure: true,
              sameSite: "strict",
              maxAge: 604800000, // 7 hari dalam milidetik
            })
            .header("Authorization", accessToken)
            .json({
              accessToken: accessToken,
              refreshToken: refreshToken,
              userId: loggedUser._id.toString(),
            });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

// Logika logout pengguna
exports.logout = (req, res, next) => {
  try {
    // Temukan dan hapus token refresh pengguna
    UserToken.findOneAndDelete({ token: req.cookies["resfreshToken"] }).then(
      (refToken) => {
        if (!refToken)
          res
            .header("Clear-Site-Data", '"cookies","storage"')
            .status(200)
            .json({ error: false, message: "Berhasil Keluar" });
        else
          res
            .header("Clear-Site-Data", '"cookies","storage"')
            .status(200)
            .json({ error: false, message: "Berhasil Keluar" });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: false, message: "Kesalahan Server Internal" });
  }
};

// Fungsi untuk menghasilkan token akses dan refresh untuk pengguna
const generateTokens = (user) => {
  try {
    const payload = {
      email: user.email,
      userId: user._id.toString(),
      roles: user.roles,
    };

    // Menghasilkan token akses dengan waktu kedaluwarsa yang singkat (mis., 14 menit)
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
      expiresIn: "14m",
    });

    // Menghasilkan token refresh dengan waktu kedaluwarsa yang lebih lama (mis., 30 hari)
    const refreshToken = jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_PRIVATE_KEY,
      { expiresIn: "30d" }
    );

    // Temukan dan hapus token refresh yang sudah ada untuk pengguna
    UserToken.findOneAndDelete({ userId: user._id })
      .then((userToken) => {})
      .catch((err) => console.log(err));

    // Buat instance UserToken baru dengan token refresh yang baru
    const newtoken = new UserToken({ userId: user._id, token: refreshToken });

    // Simpan token refresh yang baru ke dalam database
    return newtoken
      .save()
      .then((res) => {
        console.log("Login dan token pengguna baru berhasil disimpan");
        return { accessToken, refreshToken };
      })
      .catch((err) => console.log(err));
  } catch (err) {
    console.log(err);
    console.log(err);
    return Promise.reject(err);
  }
};
