import styles from "./style.module.scss";

const SimplePagination = ({ limit, setLimit = () => {}, page = 1, setPage = () => {}, pageCount = 1 }) => {

  const handlePrev = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setPage((prev) => Math.min(prev + 1, pageCount));
  };

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setPage(1);
  };

  return (
    <div className={styles.paginationContainer}>
      <label className={styles.selectContainer}>
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
        <span className={styles.selectLabel}>
          Page {page} of {pageCount}
        </span>
      </label>
      <div className={styles.paginationActions}>
        <button
          className={styles.actionBtn}
          onClick={handlePrev}
          disabled={page === 1}
        >
          Prev
        </button>
        <button
          className={styles.actionBtn}
          onClick={handleNext}
          disabled={page === pageCount}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SimplePagination;
