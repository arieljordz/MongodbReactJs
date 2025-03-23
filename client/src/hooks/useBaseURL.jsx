import { useState, useEffect, useCallback } from "react";

const useBaseURL = () => {

  // const BASE_URL = "http://localhost:3001";
  const BASE_URL = "https://e-learning-backend-fidh.onrender.com";

  return {
    BASE_URL,
  };
};

export default useBaseURL;
