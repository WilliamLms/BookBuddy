import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchBooks = createAsyncThunk("books/fetchBooks", async () => {
  try {
    const response = await fetch("https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api/books");
    const data = await response.json();


    if (!data.books || !Array.isArray(data.books)) {
      throw new Error("Invalid API response format: Expected an object with a `books` array");
    }

    return data.books; 
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
});

const booksSlice = createSlice({
  name: "books",
  initialState: { books: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.books = action.payload; 
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default booksSlice.reducer;
