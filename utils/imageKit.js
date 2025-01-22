// imageKit.js
import ImageKit from "imagekit";

const initImageKit = function () {
  var imagekit = new ImageKit({
    publicKey: "public_oqQN8SMh7G7s2UigLPygQTU0PFw=",
    privateKey: "private_r2N2uQmthK7FG+nEKFDOBhTKnBk=",
    urlEndpoint: "https://ik.imagekit.io/qmst9yz0b/",
  });

  return imagekit;
};

export { initImageKit };
