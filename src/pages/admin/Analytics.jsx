import styles from "./AdminPages.module.scss";

const Analytics = () => {
  const analyticsData = [
    {
      title: "Sales Overview",
      value: "$45,678",
      change: "+15.3%",
      changeType: "positive",
      period: "vs last month",
    },
    {
      title: "Total Orders",
      value: "1,234",
      change: "+8.2%",
      changeType: "positive",
      period: "vs last month",
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      change: "-0.5%",
      changeType: "negative",
      period: "vs last month",
    },
    {
      title: "Average Order Value",
      value: "$89.45",
      change: "+12.1%",
      changeType: "positive",
      period: "vs last month",
    },
  ];

  return (
    <div className="admin-page">
      <div className="page-header">
        <h2>Analytics Dashboard</h2>
        <p>Track your business performance and key metrics</p>
      </div>

      <div className="analytics-grid">
        {analyticsData.map((item, index) => (
          <div
            key={index}
            className="analytics-card">
            <div className="analytics-header">
              <h3 className="analytics-title">{item.title}</h3>
              <div className={`analytics-change ${item.changeType}`}>
                {item.change}
              </div>
            </div>
            <div className="analytics-content">
              <div className="analytics-value">{item.value}</div>
              <div className="analytics-period">{item.period}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="analytics-content-grid">
        <div className="content-card">
          <div className="card-header">
            <h3>Sales Chart</h3>
            <div className="chart-controls">
              <button className="chart-btn active">7D</button>
              <button className="chart-btn">30D</button>
              <button className="chart-btn">90D</button>
            </div>
          </div>
          <div className="chart-placeholder">
            <div className="chart-mock">
              <div className="chart-bars">
                <div
                  className="bar"
                  style={{ height: "60%" }}></div>
                <div
                  className="bar"
                  style={{ height: "80%" }}></div>
                <div
                  className="bar"
                  style={{ height: "45%" }}></div>
                <div
                  className="bar"
                  style={{ height: "90%" }}></div>
                <div
                  className="bar"
                  style={{ height: "70%" }}></div>
                <div
                  className="bar"
                  style={{ height: "85%" }}></div>
                <div
                  className="bar"
                  style={{ height: "95%" }}></div>
              </div>
              <p>Sales trend over the last 7 days</p>
            </div>
          </div>
        </div>

        <div className="content-card">
          <div className="card-header">
            <h3>Top Products</h3>
          </div>
          <div className="top-products">
            <div className="product-item">
              <div className="product-rank">1</div>
              <div className="product-info">
                <div className="product-name">Laptop Pro</div>
                <div className="product-sales">$12,450</div>
              </div>
            </div>
            <div className="product-item">
              <div className="product-rank">2</div>
              <div className="product-info">
                <div className="product-name">Wireless Headphones</div>
                <div className="product-sales">$8,920</div>
              </div>
            </div>
            <div className="product-item">
              <div className="product-rank">3</div>
              <div className="product-info">
                <div className="product-name">Smart Watch</div>
                <div className="product-sales">$6,780</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
