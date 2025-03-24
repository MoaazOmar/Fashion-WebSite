
export interface DashboardStats {
    totalSales: number;
    salesTrend: number;
    salesTrendDirection: 'up' | 'down';
    newOrders: number;
    ordersTrend: number;
    ordersTrendDirection: 'up' | 'down';
    totalVisitors: number;
    visitorsTrend: number;
    visitorsTrendDirection: 'up' | 'down';
    totalInventory: number;
    lowStockItems: number;
    }