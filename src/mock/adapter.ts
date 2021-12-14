import AxiosMockAdapter from "axios-mock-adapter";
import axios from "axios";

const axiosMockAdapter = new AxiosMockAdapter(axios, {
  delayResponse: 2000,
  onNoMatch: "passthrough",
});

export default axiosMockAdapter;
