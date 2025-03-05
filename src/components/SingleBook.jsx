import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const SingleBook = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [message, setMessage] = useState(null);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    fetch(`https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api/books/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Book Data:", data); 
        setBook(data.book); 
      })
      .catch((error) => console.error("Error fetching book details:", error));
  }, [id]);

  const handleCheckout = async () => {
    if (!token) {
      setMessage("Please log in to checkout books.");
      return;
    }

    try {
      console.log("Attempting to checkout book:", id);

      const response = await fetch(
        `https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api/books/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ available: false }),
        }
      );

      const data = await response.json();
      console.log("Checkout Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to checkout book.");
      }

      setBook(data); 
      setMessage("Book checked out successfully!");
    } catch (error) {
      console.error("Checkout Error:", error);
      setMessage(error.message);
    }
  };

  if (!book) return <p>Loading book details...</p>;

  return (
    <div>
      <h2>{book.title}</h2>
      <p>
        <strong>Author:</strong> {book.author}
      </p>
      <p>
        <strong>Description:</strong> {book.description}
      </p>
      <img
        src={book.coverimage}
        alt={book.title}
        style={{ width: "200px", height: "auto" }}
      />
    </div>
  );
};

export default SingleBook;
