export const calculateTotalRevenue = (orders) => {
  if (!Array.isArray(orders)) return 0;

  // Option 1: include all orders (delivered, pending, etc.)
  // return orders.reduce((sum, order) => sum + order.total_amount, 0);

  // Option 2: only count "delivered" orders as revenue
  return orders
    .filter(order => order.status === "delivered")
    .reduce((sum, order) => sum + order.total_amount, 0);
};



// Utility function to aggregate order data by month
export const aggregateOrdersByMonth = (orders) => {
  if (!orders || !Array.isArray(orders)) return [];

  // Map month numbers to short names
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Aggregate revenue and count per month
  const monthlyData = {};

  orders.forEach(order => {
    const date = new Date(order.created_at);
    const monthIndex = date.getMonth();
    const monthName = monthNames[monthIndex];

    if (!monthlyData[monthName]) {
      monthlyData[monthName] = { month: monthName, revenue: 0, orders: 0 };
    }

    // Count only *completed* or *delivered* orders for revenue
    if (order.status === "delivered") {
      monthlyData[monthName].revenue += order.total_amount || 0;
    }

    // Count all orders regardless of status
    monthlyData[monthName].orders += 1;
  });

  // Return as sorted array by month order
  return monthNames
    .filter(m => monthlyData[m]) // only include months with data
    .map(m => monthlyData[m]);
};



export const getRecentFiveOrdersSummary = (orders) => {
  if (!orders || !Array.isArray(orders)) return [];

  // Sort by date (newest first)
  const sorted = [...orders].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  // Get the most recent 5 orders
  const recentFive = sorted.slice(0, 5);

  return recentFive
};

