import { config } from "dotenv";
import mongoose from "mongoose";
import User from "../src/models/User";
import Property from "../src/models/Property";
import Lead from "../src/models/Lead";
import Transaction from "../src/models/Transaction";
import Lease from "../src/models/Lease";
import Tenant from "../src/models/Tenant";
import { hashPassword } from "../src/lib/auth";

config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

async function seed() {
  if (!MONGODB_URI) {
    console.error("Missing MONGODB_URI");
    process.exit(1);
  }

  try {
    console.log("Connecting to database...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected. Clearing old data...");

    await User.deleteMany({});
    await Property.deleteMany({});
    await Lead.deleteMany({});
    await Transaction.deleteMany({});
    await Lease.deleteMany({});
    await Tenant.deleteMany({});

    console.log("Creating Master Tenant...");
    const tenant = await Tenant.create({
      companyName: "Elite Homes Partners",
      subdomain: "elitehomes",
      subscriptionPlan: "enterprise",
      subscriptionStatus: "active",
      adminEmail: "admin@realtyos.com",
      activeModules: ["sales_crm", "lettings_management", "construction_erp", "hr_directory", "financials"]
    });

    console.log("Creating Admin User...");
    const adminPass = await hashPassword("password123");
    const admin = await User.create({
      tenantId: tenant._id,
      firstName: "Admin",
      lastName: "User",
      email: "admin@realtyos.com",
      passwordHash: adminPass,
      role: "superadmin",
    });

    const agentPass = await hashPassword("password123");
    const agent = await User.create({
      tenantId: tenant._id,
      firstName: "Tobi",
      lastName: "Ogunleye",
      email: "tobi@realtyos.com",
      passwordHash: agentPass,
      role: "agent",
    });

    console.log("Creating Properties...");
    const prop1 = await Property.create({
      tenantId: tenant._id,
      title: "Luxury 4 Bed Duplex in Lekki",
      description: "A beautiful fully serviced duplex in the heart of Lekki Phase 1.",
      propertyType: "residential",
      status: "available",
      price: 150000000,
      currency: "NGN",
      address: "12 Admiralty Way",
      city: "Lekki",
      state: "Lagos",
      bedrooms: 4,
      bathrooms: 4.5,
      sizeSqm: 450,
      titleDocument: "C_of_O",
      isServiced: true,
      images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"],
      assignedAgent: agent._id,
    });

    const prop2 = await Property.create({
      tenantId: tenant._id,
      title: "Commercial Office Space in VI",
      description: "Prime office location in Victoria Island.",
      propertyType: "commercial",
      status: "rented",
      price: 15000000,
      currency: "NGN",
      address: "8 Adeola Odeku St",
      city: "Victoria Island",
      state: "Lagos",
      sizeSqm: 1200,
      titleDocument: "Deed_of_Assignment",
      isServiced: true,
      images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"],
    });

    console.log("Creating Leads...");
    const lead1 = await Lead.create({
      tenantId: tenant._id,
      firstName: "Chioma",
      lastName: "Adeleke",
      email: "chioma@example.com",
      phone: "+2348012345678",
      status: "negotiating",
      budget: 140000000,
      currency: "NGN",
      interestedProperty: prop1._id,
      assignedAgent: agent._id,
      source: "website",
    });

    const lead2 = await Lead.create({
      tenantId: tenant._id,
      firstName: "Musa",
      lastName: "Ibrahim",
      email: "musa@example.com",
      phone: "+2348098765432",
      status: "new",
      budget: 20000000,
      currency: "NGN",
      source: "referral",
    });

    console.log("Creating Transactions...");
    await Transaction.create({
      tenantId: tenant._id,
      reference: "TXN-849201",
      type: "rent",
      amount: 15000000,
      currency: "NGN",
      status: "completed",
      paymentMethod: "bank_transfer",
      relatedProperty: prop2._id,
      paymentDate: new Date(),
    });

    await Transaction.create({
      tenantId: tenant._id,
      reference: "TXN-112349",
      type: "sale",
      amount: 150000000,
      currency: "NGN",
      status: "pending",
      paymentMethod: "paystack",
      relatedProperty: prop1._id,
      relatedLead: lead1._id,
    });

    console.log("Creating Leases...");
    await Lease.create({
      tenantId: tenant._id,
      property: prop2._id,
      tenantName: "TechCorp Nigeria",
      tenantEmail: "admin@techcorp.ng",
      tenantPhone: "+2348100000000",
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      rentAmount: 15000000,
      currency: "NGN",
      paymentFrequency: "yearly",
      status: "active",
      legalFeeAmount: 750000,
      agencyFeeAmount: 1500000,
    });

    console.log("Seed complete! 🌱");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seed();
