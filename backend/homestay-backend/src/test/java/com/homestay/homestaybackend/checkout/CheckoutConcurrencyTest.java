package com.homestay.homestaybackend.checkout;

import org.junit.jupiter.api.Test;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.assertEquals;

class CheckoutConcurrencyTest {

    @Test
    void onlyOneCustomerCanBuyTheLastRoom() throws InterruptedException {
        Inventory inventory = new Inventory(1);

        CountDownLatch startSignal = new CountDownLatch(1);
        CountDownLatch finishSignal = new CountDownLatch(2);

        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger failedCount = new AtomicInteger(0);

        Runnable customer = () -> {
            try {
                startSignal.await();

                if (inventory.buy()) {
                    successCount.incrementAndGet();
                } else {
                    failedCount.incrementAndGet();
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            } finally {
                finishSignal.countDown();
            }
        };

        Thread customer1 = new Thread(customer);
        Thread customer2 = new Thread(customer);

        customer1.start();
        customer2.start();

        startSignal.countDown();
        finishSignal.await();

        assertEquals(1, successCount.get());
        assertEquals(1, failedCount.get());
        assertEquals(0, inventory.getAvailableQuantity());
    }

    static class Inventory {

        private int availableQuantity;

        Inventory(int availableQuantity) {
            this.availableQuantity = availableQuantity;
        }

        synchronized boolean buy() {
            if (availableQuantity <= 0) {
                return false;
            }

            availableQuantity--;
            return true;
        }

        int getAvailableQuantity() {
            return availableQuantity;
        }
    }
}
