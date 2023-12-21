import AWS from "aws-sdk";
import PDFDocument from "pdfkit";
import sharp from "sharp";

export async function uploadToS3(file: File) {
  const isImage = file.type === "image/png" || file.type === "image/jpeg";
  try {
    AWS.config.update({
      accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
    });

    const s3 = new AWS.S3({
      params: {
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
      },
      region: process.env.NEXT_PUBLIC_S3_REGION_NAME,
    });

    const file_key =
      "uploads/" + Date.now().toString() + file.name.replace(" ", "-");

    if (isImage) {
      console.log("File is image");
      try {
        const result = await convertImageToPDF(
          file_key.replace(/\.(png|jpeg)$/i, ".pdf"),
          file
        );
        //file = result;
      } catch (error) {
        console.log(error);
        throw error;
      }
    }

    const params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
      Key: file_key,
      Body: file,
    };

    const upload = s3
      .putObject(params)
      .on("httpUploadProgress", (event) => {
        console.log(
          "uploading to s3...",
          parseInt(((event.loaded * 100) / event.total).toString()) + "%"
        );
      })
      .promise();

    await upload.then(() => {
      console.log("Successfully uploaded to S3!", file_key);
    });

    return Promise.resolve({
      file_key,
      file_name: file.name,
    });
  } catch (error) {
    throw error;
  }
}

export function getS3Url(file_key: string) {
  const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.eu-central-1.amazonaws.com/${file_key}`;
  return url;
}

//TO-DO: FIX
async function convertImageToPDF(file_key: string, { name }: File) {
  // const doc = new PDFDocument();
  // const buffers: Buffer[] = [];
  // const imageBuffer = await sharp(name).toBuffer();
  // const imageWidth = 500;
  // doc.image(imageBuffer, 0, 0, { width: imageWidth });
  // doc.end();
  // doc.on("data", (chunk) => {
  //   buffers.push(chunk);
  // });
  // return new Promise<File>((resolve) => {
  //   doc.on("end", () => {
  //     const pdfBuffer = Buffer.concat(buffers);
  //     const file = new File([pdfBuffer], `${file_key}.pdf`, {
  //       type: "application/pdf",
  //     });
  //     resolve(file);
  //   });
  // });
}
