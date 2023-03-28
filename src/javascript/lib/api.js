export default async function api() {
  const API_ADDR = "https://test.api.weniv.co.kr";
  const request = async (url) => {
    try {
      const response = await fetch(url, {});
      if (response.ok) {
        // fetch가 제대로 들어 왔는지 판별
        const data = await response.json();
        return data;
      } else {
        const errorData = await response.json();
        throw errorData;
      }
    } catch (e) {
      console.log(e);
    }
  };

  return {
    API_ADDR,
    fetchProductsList: async () => {
      return await request(`${API_ADDR}/mall`);
    },
    fetchProduct: async (Id) => {
      return await request(`${API_ADDR}/mall/${Id}`);
    },
    fetchCoupon: async () => {
      return await request(`${API_ADDR}/coupon`);
    },
  };
}
