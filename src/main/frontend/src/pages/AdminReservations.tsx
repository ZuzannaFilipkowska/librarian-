import {useContext, useEffect, useState} from "react";
import LibraryContext from "../context/LibraryContext";
import {Book} from "../models/Book";
import {User} from "../models/User";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min'
import Toast from "react-bootstrap/Toast";

function AdminReservations() {
    const [isLoading, setIsLoading] = useState(true);
    const [books, setBooks] = useState([]);
    const [message, setMessage] = useState('');
    const [showToast, setShowToast] = useState(false);

    const user: User = useContext(LibraryContext).user;
    const isAdmin: boolean = false;

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks= async () => {
        const response = await fetch(`/api/books/reserved`);
        const data = await response.json();
        setBooks(data);
        setIsLoading(false);
    };

    const bookBook = async (book: any) => {
        setShowToast(false);
        const response = await fetch(`/api/books/admin/book`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(book),
        }).then(response => {
            if (response.ok) {
                setMessage("Status change successful");
            }
            else {
                setMessage("Error occured. Other user modified this position.");
            }
            fetchBooks();
            setShowToast(true);
        });



    };

    if (!isLoading && (!books || books.length === 0)) {
        return <p>No books</p>;
    }
    // @ts-ignore
    return isLoading ? (
        <h3>Loading...</h3>
    ) : (
        <>
            <h2> Hello {user?.username}</h2>
            <Toast show={showToast} delay={4000} autohide>
                <Toast.Header>
                </Toast.Header>
                <Toast.Body>{message}</Toast.Body>
            </Toast>
            <div>
                <table className="table table-striped table-hover">
                    <thead>
                    <tr>
                        <th scope={"col"}>#</th>
                        <th scope={"col"}>Title</th>
                        <th scope={"col"}>Author</th>
                        <th scope={"col"}>Status</th>
                        {!user?.isAdmin && <th scope={"col"}>Action</th>}
                    </tr>
                    </thead>
                    <tbody>
                    {books.map((book: Book, index) => <tr key={book.id}>
                            <th scope={"row"}>{index + 1}</th>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>{book.status}</td>
                            <td>
                                    <button className="btn btn-info"
                                            onClick={() => bookBook(book)}>
                                        Book
                                    </button>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>

            </div>
        </>

    );
}

export default AdminReservations;