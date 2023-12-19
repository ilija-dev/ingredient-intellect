import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import { downloadFromS3 } from "./s3-server";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import {
  RecursiveCharacterTextSplitter,
  Document,
} from "@pinecone-database/doc-splitter";
import { getEmbeddings } from "./embeddings";
import md5 from "md5";
import { convertToAscii } from "./utils";

type PDFPage = {
  pageContent: string;
  metadata: {
    loc: { pageNumber: number };
  };
};

let pinecone: Pinecone | null = null;

export const getPineconeClient = async () => {
  if (!pinecone) {
    pinecone = new Pinecone({
      environment: process.env.PINECONE_ENVIRONMENT!,
      apiKey: process.env.PINECONE_API_KEY!,
    });
  }
  return pinecone;
};

export const truncateStringByBytes = (str: string, bytes: number) => {
  const encoder = new TextEncoder();
  return new TextDecoder("utf-8").decode(encoder.encode(str).slice(0, bytes));
};

async function embedDocument(doc: Document, fileKey: string) {
  try {
    const embeddings = await getEmbeddings(doc.pageContent);
    const hash = md5(doc.pageContent);
    return {
      id: hash,
      values: embeddings,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
        fileKey,
      },
    } as PineconeRecord;
  } catch (error) {
    console.log("Error in embedDocument", error);
    throw error;
  }
}

async function prepareDocument(page: PDFPage, fileKey: string) {
  let { pageContent, metadata } = page;

  pageContent = pageContent.replace(/\n/g, " ");
  const splitter = new RecursiveCharacterTextSplitter();
  try {
    const docs = await splitter.splitDocuments([
      new Document({
        pageContent,
        metadata: {
          pageNumber: metadata.loc.pageNumber,
          text: truncateStringByBytes(pageContent, 36000),
          fileKey,
        },
      }),
    ]);

    console.log("Preparing document completed successfully");
    return docs;
  } catch (error) {
    console.log(error);
  }
}

export async function loadS3IntoPinecone(fileKey: string) {
  //Get PDF from S3
  const file_name = await downloadFromS3(fileKey);

  if (!file_name) throw new Error("Could not download from S3");
  const loader = new PDFLoader(file_name);
  const pages = (await loader.load()) as PDFPage[];
  //Split and segment the PDF
  const documents = await Promise.all(
    pages.map((page) => prepareDocument(page, fileKey))
  );

  if (!documents) {
    console.log("Something went wrong");
    return;
  }

  //Vectorize and embed individual documents
  const vectors = await Promise.all(
    documents.flat().map((doc) => embedDocument(doc!, fileKey))
  );

  //Upload to Pinecone
  const client = await getPineconeClient();
  const pineconeIndex = client.Index(process.env.PINECONE_INDEX_NAME!);
  pineconeIndex.upsert(vectors);

  return documents[0];
}
