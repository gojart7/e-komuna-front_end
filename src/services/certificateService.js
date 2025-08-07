import axios from "axios";

const API_BASE_URL = "https://localhost:7060/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

export const getCitizenCertificates = async (citizenId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/CitizenCertificate/${citizenId}/my`,
      { headers: getAuthHeaders() }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching certificates:", error);
    throw error;
  }
};

export const payCertificate = async (certificateId, amount, currency) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/CitizenCertificate/pay/${certificateId}`,
      { amount, currency },
      { headers: { ...getAuthHeaders(), "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error) {
    console.error("Error processing payment:", error);
    throw error;
  }
};

export const markCertificateAsPaid = async (certificateId) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/CitizenCertificate/${certificateId}/mark-paid`,
      {},
      { headers: { ...getAuthHeaders(), "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error) {
    console.error("Error marking certificate as paid:", error);
    throw new Error("Failed to mark as paid");
  }
};

export const downloadCertificate = async (certificateId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/CitizenCertificate/${certificateId}/download`,
      {
        headers: getAuthHeaders(),
        responseType: "blob",
      }
    );

    const blob = new Blob([response.data]);
    const fileURL = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = fileURL;
    link.download = `certificate_${certificateId}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("Failed to download certificate", error);
    throw new Error("Failed to download certificate");
  }
};

export const requestCertificate = async (certificateType) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/CitizenCertificate/request`,
      certificateType,
      {
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to request certificate", error);
    throw new Error("Failed to request certificate");
  }
};

export const allowedCurrencies = [
  "usd",
  "aed",
  "afn",
  "all",
  "amd",
  "ang",
  "aoa",
  "ars",
  "aud",
  "awg",
  "azn",
  "bam",
  "bbd",
  "bdt",
  "bgn",
  "bhd",
  "bif",
  "bmd",
  "bnd",
  "bob",
  "brl",
  "bsd",
  "bwp",
  "byn",
  "bzd",
  "cad",
  "cdf",
  "chf",
  "clp",
  "cny",
  "cop",
  "crc",
  "cve",
  "czk",
  "djf",
  "dkk",
  "dop",
  "dzd",
  "egp",
  "etb",
  "eur",
  "fjd",
  "fkp",
  "gbp",
  "gel",
  "gip",
  "gmd",
  "gnf",
  "gtq",
  "gyd",
  "hkd",
  "hnl",
  "hrk",
  "htg",
  "huf",
  "idr",
  "ils",
  "inr",
  "isk",
  "jmd",
  "jod",
  "jpy",
  "kes",
  "kgs",
  "khr",
  "kmf",
  "krw",
  "kwd",
  "kyd",
  "kzt",
  "lak",
  "lbp",
  "lkr",
  "lrd",
  "lsl",
  "mad",
  "mdl",
  "mga",
  "mkd",
  "mmk",
  "mnt",
  "mop",
  "mur",
  "mvr",
  "mwk",
  "mxn",
  "myr",
  "mzn",
  "nad",
  "ngn",
  "nio",
  "nok",
  "npr",
  "nzd",
  "omr",
  "pab",
  "pen",
  "pgk",
  "php",
  "pkr",
  "pln",
  "pyg",
  "qar",
  "ron",
  "rsd",
  "rub",
  "rwf",
  "sar",
  "sbd",
  "scr",
  "sek",
  "sgd",
  "shp",
  "sle",
  "sos",
  "srd",
  "std",
  "szl",
  "thb",
  "tjs",
  "tnd",
  "top",
  "try",
  "ttd",
  "twd",
  "tzs",
  "uah",
  "ugx",
  "uyu",
  "uzs",
  "vnd",
  "vuv",
  "wst",
  "xaf",
  "xcd",
  "xcg",
  "xof",
  "xpf",
  "yer",
  "zar",
  "zmw",
  "usdc",
  "btn",
  "ghs",
  "eek",
  "lvl",
  "svc",
  "vef",
  "ltl",
  "sll",
  "mro",
];
