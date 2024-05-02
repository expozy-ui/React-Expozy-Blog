// lib/dbConnect.js
import mongoose from "mongoose";
import Axios from "axios";
import { setupCache } from 'axios-cache-interceptor';

const api = "https://core.expozy.com/api/";
const token = 'zsssqz2qGsK3TcDOEW';

let cached = global.mongoose;

const instance = Axios.create();
const axios = setupCache(instance);

async function fetchSettings() {
  try {
    const urlSettings = api + 'settings';
    const responseSettings = await axios.get(urlSettings, {
      headers: {
        Authentication: `Basic ${token}`,
      },
    });
    return responseSettings.data; // Return the settings data
  } catch (error) {
    console.error('Error fetching website settings:', error);
    return null;
  }
}

async function fetchProducts(all) {
  try {
    const url = api + 'products';
    const params = {
      limit: 9,
      page: all.page
    };
    //
    const response = await axios.get(url, {
      headers: {
        Authentication: `Basic ${token}`,
      },
      params: params,
    });
    return response.data; // Return the blog posts data
  } catch (error) {
    console.error('Error fetching products posts:', error);
    return null;
  }
}

async function fetchProductById(id) {
  try {
    const url = api + `products/${id}`;
    const response = await axios.get(url, {
      headers: {
        Authentication: `Basic ${token}`,
      },
    });
    return response.data; // Return the blog products data
  } catch (error) {
    console.error('Error fetching products:', error);
    return null;
  }
}

async function fetchBlogPosts(all) {
  try {
    const url = api + 'blogPosts';
    const params = {
      limit: 9,
      page: all.page,
      'tags[]': all.firstTag,
      category_id: all.category_id
    };
    //
    const response = await axios.get(url, {
      headers: {
        Authentication: `Basic ${token}`,
      },
      params: params,
    });
    return response.data; // Return the blog posts data
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return null;
  }
}

async function fetchBlogPostById(id) {
  try {
    const url = api + `blogPosts/${id}`;
    const response = await axios.get(url, {
      headers: {
        Authentication: `Basic ${token}`,
      },
    });
    return response.data; // Return the blog posts data
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return null;
  }
}

async function fetchBlogCategories() {
  try {
    const url = api + 'blogCategories';
    const response = await axios.get(url, {
      headers: {
        Authentication: `Basic ${token}`,
      },
    });
    return response.data; // Return the blogCategories data
  } catch (error) {
    console.error('Error fetching blogCategories:', error);
    return null;
  }
}

async function fetchBlogTags() {
  try {
    const url = api + 'blogPosts_filters';
    const response = await axios.get(url, {
      headers: {
        Authentication: `Basic ${token}`,
      },
    });
    return response.data; // Return the blogTags data
  } catch (error) {
    console.error('Error fetching blogTags:', error);
    return null;
  }
}

async function fetchCurrencies() {
  try {
    const url = api + 'currencies';
    const response = await axios.get(url, {
      headers: {
        Authentication: `Basic ${token}`,
      },
    });
    return response.data; // Return the blog posts data
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return null;
  }
}

async function dbConnect() {

  const MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI) {
    throw new Error(
      "Please define the MONGO_URI environment variable inside .env.development"
    );
  }

  if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;

export { fetchBlogTags, fetchBlogCategories, fetchSettings, fetchBlogPosts, fetchBlogPostById, fetchCurrencies, fetchProducts, fetchProductById };