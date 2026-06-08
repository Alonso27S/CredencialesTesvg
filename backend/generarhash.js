// generarHash.js
import bcrypt from "bcryptjs";

const generarHash = async () => {
  try {
    const password = "Lun4D3lg4d0"  //  Contraseña nueva

    console.log(" Generando hash para:", password);

    const saltRounds = 10; // 
    const hash = await bcrypt.hash(password, saltRounds);

    console.log("HASH GENERADO:");
    console.log(hash);


  } catch (error) {
    console.error(" Error generando hash:", error);
  }
};

generarHash();
