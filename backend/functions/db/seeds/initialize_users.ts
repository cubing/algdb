import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("user").del();

  // Inserts seed entries
  await knex("user").insert([
    {
      provider: "wca",
      provider_id: "277",
      wca_id: "2008VIRO01",
      email: "277@worldcubeassociation.org",
      name: "Philippe Virouleau",
      avatar:
        "https://staging.worldcubeassociation.org/uploads/user/avatar/2008VIRO01/1473886131.jpg",
      country: "FR",
      is_public: true,
      role: "3",
      permissions: null,
      created_by: 0,
    },
    {
      provider: "wca",
      provider_id: "73",
      wca_id: "2014GROV01",
      email: "73@worldcubeassociation.org",
      name: "Saransh Grover",
      avatar:
        "https://staging.worldcubeassociation.org/uploads/user/avatar/2014GROV01/1530549845.jpg",
      country: "IN",
      is_public: true,
      role: "3",
      permissions: null,
      created_by: 0,
    },
    {
      provider: "wca",
      provider_id: "8184",
      wca_id: "2016HOOV01",
      email: "8184@worldcubeassociation.org",
      name: "Caleb Hoover",
      avatar:
        "https://staging.worldcubeassociation.org/uploads/user/avatar/2016HOOV01/1533053687.JPG",
      country: "US",
      is_public: true,
      role: "3",
      permissions: null,
      created_by: 0,
    },
  ]);
}
