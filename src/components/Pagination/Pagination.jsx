import ReactPaginate from "react-paginate";
import styles from "./style.module.scss";

const  Pagination = ({ limit, setLimit = () => {}, page, setPage = () => {}, count }) => {
  // const [limit, setLimit] = useState(10);
  // const [page, setPage] = useState(0);

  const pageCount = count;

  const handlePageClick = (event) => {
    setPage(event.selected);
  };

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setPage(0);
  };

  return (
    <div style={{ padding: 20 }}>
      <label>
        <select
          className={styles.select}
          value={limit}
          onChange={handleLimitChange}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </label>
      <ReactPaginate
        previousLabel={"prev"}
        nextLabel={"next"}
        pageCount={pageCount}
        onPageChange={handlePageClick}
        // containerClassName={"pagination"}
        // activeClassName={"active"}
        forcePage={page}
      />
    </div>
  );
};

export default Pagination;
