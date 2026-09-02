import { expect, test } from "@playwright/test";

test.describe("vehicle request form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/fr/contact");
  });

  test("rejects an invalid submission and reports it on the field", async ({ page }) => {
    await page.getByLabel("Prénom").fill("");
    await page.getByLabel(/adresse e-mail/i).fill("not-an-email");
    await page.getByRole("button", { name: /demander un véhicule/i }).click();

    await expect(page.getByText("Veuillez indiquer votre prénom.")).toBeVisible();
    await expect(page.getByText("Veuillez saisir une adresse e-mail valide.")).toBeVisible();
    await expect(page.getByLabel(/adresse e-mail/i)).toHaveAttribute("aria-invalid", "true");
  });

  test("requires a choice in the two select fields", async ({ page }) => {
    await page.getByLabel("Prénom").fill("Ada");
    await page.getByLabel("Nom", { exact: true }).fill("Lovelace");
    await page.getByLabel(/adresse e-mail/i).fill("ada@example.com");
    await page.getByLabel(/quel véhicule recherchez-vous/i).fill("Honda Civic Type R EK9");
    await page.getByLabel(/année \/ génération/i).fill("1996-2000");
    await page.getByLabel(/budget/i).fill("CHF 35,000");
    // Transmission and condition deliberately left on the placeholder option.
    await page.getByRole("button", { name: /demander un véhicule/i }).click();

    await expect(page.getByText("Veuillez choisir une boîte de vitesses.")).toBeVisible();
    await expect(page.getByText("Veuillez choisir un état de véhicule.")).toBeVisible();
  });

  test("accepts a complete request and clears the form", async ({ page }) => {
    await page.getByLabel("Prénom").fill("Ada");
    await page.getByLabel("Nom", { exact: true }).fill("Lovelace");
    await page.getByLabel(/adresse e-mail/i).fill("ada@example.com");
    await page.getByLabel(/téléphone \/ whatsapp/i).fill("+41 78 811 83 14");
    await page.getByLabel(/quel véhicule recherchez-vous/i).fill("Honda Civic Type R EK9");
    await page.getByLabel(/année \/ génération/i).fill("1996-2000");
    await page.getByLabel(/budget/i).fill("CHF 35,000");
    await page.getByLabel(/boîte de vitesses/i).selectOption("manual");
    await page.getByLabel(/état du véhicule/i).selectOption("excellent");
    await page.getByLabel(/exigences supplémentaires/i).fill("Championship White, unmodified");
    await page.getByLabel(/autre chose/i).fill("Happy to wait for the right car.");
    await page.getByLabel(/comment avez-vous connu/i).selectOption("instagram");

    await page.getByRole("button", { name: /demander un véhicule/i }).click();

    await expect(page.getByText(/nous revenons vers vous/i).first()).toBeVisible();
    await expect(page.getByLabel("Prénom")).toHaveValue("");
  });

  test("keeps what the visitor typed when validation fails", async ({ page }) => {
    // A rejected submission must never cost the visitor their work. React
    // resets an uncontrolled form action to each field's defaultValue, so the
    // action has to hand those values back.
    await page.getByLabel("Prénom").fill("Claudio");
    await page.getByLabel("Nom", { exact: true }).fill("Santos");
    await page.getByLabel(/adresse e-mail/i).fill("pas-un-email");
    await page.getByLabel(/téléphone \/ whatsapp/i).fill("+41 78 811 83 14");
    await page.getByLabel(/quel véhicule recherchez-vous/i).fill("Nissan Skyline R34");
    await page.getByLabel(/année \/ génération/i).fill("1999");
    await page.getByLabel(/budget/i).fill("CHF 60 000");
    await page.getByLabel(/boîte de vitesses/i).selectOption("manual");
    await page.getByLabel(/état du véhicule/i).selectOption("excellent");
    await page.getByLabel(/exigences supplémentaires/i).fill("Bayside Blue, non modifiée");
    await page.getByLabel(/autre chose/i).fill("Je peux attendre la bonne voiture.");
    await page.getByLabel(/comment avez-vous connu/i).selectOption("instagram");

    await page.getByRole("button", { name: /demander un véhicule/i }).click();
    await expect(page.getByText("Veuillez saisir une adresse e-mail valide.")).toBeVisible();

    await expect(page.getByLabel("Prénom")).toHaveValue("Claudio");
    await expect(page.getByLabel("Nom", { exact: true })).toHaveValue("Santos");
    await expect(page.getByLabel(/adresse e-mail/i)).toHaveValue("pas-un-email");
    await expect(page.getByLabel(/téléphone \/ whatsapp/i)).toHaveValue("+41 78 811 83 14");
    await expect(page.getByLabel(/quel véhicule recherchez-vous/i)).toHaveValue(
      "Nissan Skyline R34",
    );
    await expect(page.getByLabel(/année \/ génération/i)).toHaveValue("1999");
    await expect(page.getByLabel(/budget/i)).toHaveValue("CHF 60 000");
    await expect(page.getByLabel(/boîte de vitesses/i)).toHaveValue("manual");
    await expect(page.getByLabel(/état du véhicule/i)).toHaveValue("excellent");
    await expect(page.getByLabel(/exigences supplémentaires/i)).toHaveValue(
      "Bayside Blue, non modifiée",
    );
    await expect(page.getByLabel(/autre chose/i)).toHaveValue("Je peux attendre la bonne voiture.");
    await expect(page.getByLabel(/comment avez-vous connu/i)).toHaveValue("instagram");

    // A second failure must hold too: the echoed values are unchanged between
    // the two renders, so nothing can rely on a prop transition to restore them.
    await page.getByRole("button", { name: /demander un véhicule/i }).click();
    await expect(page.getByText("Veuillez saisir une adresse e-mail valide.")).toBeVisible();
    await expect(page.getByLabel("Prénom")).toHaveValue("Claudio");
    await expect(page.getByLabel(/boîte de vitesses/i)).toHaveValue("manual");
    await expect(page.getByLabel(/état du véhicule/i)).toHaveValue("excellent");
    await expect(page.getByLabel(/comment avez-vous connu/i)).toHaveValue("instagram");
  });

  test("accepts a request that leaves the surname blank", async ({ page }) => {
    await page.getByLabel("Prénom").fill("Claudio");
    // Surname deliberately left empty: it is not a required field.
    await page.getByLabel(/adresse e-mail/i).fill("claudio@example.com");
    await page.getByLabel(/quel véhicule recherchez-vous/i).fill("Nissan Skyline R34");
    await page.getByLabel(/année \/ génération/i).fill("1999");
    await page.getByLabel(/budget/i).fill("CHF 60 000");
    await page.getByLabel(/boîte de vitesses/i).selectOption("manual");
    await page.getByLabel(/état du véhicule/i).selectOption("excellent");

    await page.getByRole("button", { name: /demander un véhicule/i }).click();

    await expect(page.getByText(/nous revenons vers vous/i).first()).toBeVisible();
  });

  test("keeps the honeypot out of the accessibility tree", async ({ page }) => {
    const honeypot = page.locator('input[name="website"]');

    await expect(honeypot).toHaveCount(1);
    await expect(honeypot).toBeHidden();
    await expect(honeypot).toHaveAttribute("tabindex", "-1");
  });
});
