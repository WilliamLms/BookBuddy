import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const Account = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [checkedOutBooks, setCheckedOutBooks] = useState([]);

  useEffect(() => {
    if (!token) {
      console.log("No token found, user not logged in.");
      return;
    }

    const fetchCheckedOutBooks = async () => {
      try {
        const response = await fetch("https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch account details.");
        }

        setCheckedOutBooks(data.books || []);
      } catch (error) {
        console.error("Error fetching user account:", error);
      }
    };

    fetchCheckedOutBooks();
  }, [token]);

  if (!user) {
    return <p>Please log in to view your account.</p>;
  }

  return (
    <div>
      <h2>Welcome, {user.email}!</h2>
      <h3>Your Checked-Out Books:</h3>
      {checkedOutBooks.length > 0 ? (
        <ul>
          {checkedOutBooks.map((book) => (
            <li key={book.id}>{book.title}</li>
          ))}
        </ul>
      ) : (
        <p>You have no checked-out books.</p>
      )}
    </div>
  );
};

export default Account;
