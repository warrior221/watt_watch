const BASE_URL = "http://localhost:8000";

export const getNodes = async () => {
    const res = await fetch(`${BASE_URL}/nodes`);
    return res.json();
};

export const triggerDetection = async () => {
    const res = await fetch(`${BASE_URL}/detect`, {
        method: "POST"
    });
    return res.json();
};

export const uploadLoadCsv = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${BASE_URL}/upload-load`, {
        method: "POST",
        body: formData,
    });
    return res.json();
};
