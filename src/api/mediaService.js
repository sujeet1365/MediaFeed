import axios from 'axios';
//these keys we should be getting from API's for more security
const API_KEY = 'M9Moel9GsArJamlr5r9jreQwZm4Z8EZRyIRAN29lEs1UszjOfZrklVAy';
const COLLECTION_ID = 'vog4mjt';
const PER_PAGE = 10;

export const fetchMediaCollection = async (page, perPage = PER_PAGE, cancelToken) => {
  try {
    const url = `https://api.pexels.com/v1/collections/${COLLECTION_ID}?page=${page}&per_page=${perPage}`;
    const { data } = await axios.get(url, {
      headers: { Authorization: API_KEY },
      cancelToken,
    });
    return data.media || [];
  } catch (error) {
    if (axios.isCancel(error)) throw error;
    throw new Error('Failed to fetch media data!');
  }
};
