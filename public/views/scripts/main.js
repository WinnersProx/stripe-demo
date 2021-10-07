const packagesElement = document.querySelectorAll(".package");
const selectedPackage = document.querySelector("#selectedPackage");
const checkoutButton = document.querySelector("#checkout button");

const packageData = {
  name: "",
  price: null,
};

packagesElement.forEach((el) => {
  el.addEventListener("click", (event) => {
    const target = event.currentTarget.children;

    setCurrentPackage({
      price: target[1].innerText,
      package: target[0].innerText,
    });
  });
});

const setCurrentPackage = ({ price, package }) => {
  packageData.name = package;
  packageData.price = price;

  selectedPackage.children[0].innerText = `Selected Package: ${package}`;
  selectedPackage.children[1].innerText = ` ${price}`;
};

checkoutButton.addEventListener("click", () => processSubscription());

const processSubscription = () => {
  const package = packageData.name;

  if (!package) return;

  fetch("/api/create-checkout-session", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      package,
    }),
  })
    .then((res) => res.json())
    .then(({ url }) => {
      redirectUser(url);
    })
    .catch((err) => alert("Something went wrong!"));
};

const redirectUser = (url) => {
  window.location = url;
};
