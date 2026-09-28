package com.homestay.homestaybackend.dashboard;

public class DashboardResponse {

    private long totalProperties;
    private long totalRooms;
    private long totalCustomers;
    private long totalBookings;
    private long totalPayments;
    private double totalRevenue;

    public DashboardResponse() {
    }

    public DashboardResponse(
            long totalProperties,
            long totalRooms,
            long totalCustomers,
            long totalBookings,
            long totalPayments,
            double totalRevenue
    ) {
        this.totalProperties = totalProperties;
        this.totalRooms = totalRooms;
        this.totalCustomers = totalCustomers;
        this.totalBookings = totalBookings;
        this.totalPayments = totalPayments;
        this.totalRevenue = totalRevenue;
    }

    public long getTotalProperties() {
        return totalProperties;
    }

    public void setTotalProperties(long totalProperties) {
        this.totalProperties = totalProperties;
    }

    public long getTotalRooms() {
        return totalRooms;
    }

    public void setTotalRooms(long totalRooms) {
        this.totalRooms = totalRooms;
    }

    public long getTotalCustomers() {
        return totalCustomers;
    }

    public void setTotalCustomers(long totalCustomers) {
        this.totalCustomers = totalCustomers;
    }

    public long getTotalBookings() {
        return totalBookings;
    }

    public void setTotalBookings(long totalBookings) {
        this.totalBookings = totalBookings;
    }

    public long getTotalPayments() {
        return totalPayments;
    }

    public void setTotalPayments(long totalPayments) {
        this.totalPayments = totalPayments;
    }

    public double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }
}

