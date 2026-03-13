import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";



actor {
  include MixinStorage();

  // Data Types ---------------------------------------
  public type ProductCategory = {
    #mechanicalPackings;
    #fluidSealants;
    #compressedAsbestosJointingSheets;
    #nonAsbestosJointingSheets;
    #wd40Products;
  };

  public type StockStatus = {
    #inStock : Nat;
    #outOfStock;
    #limited : Nat;
  };

  public type Product = {
    id : Nat;
    name : Text;
    category : ProductCategory;
    image : Text; // URL or path to image
    imageBlob : ?Storage.ExternalBlob;
    description : Text;
    specifications : [(Text, Text)];
    price : ?Nat; // Price in cents
    stockStatus : StockStatus;
  };

  public type OrderStatus = {
    #new;
    #contacted;
    #confirmed;
    #rejected;
  };

  public type CartItem = {
    productId : Nat;
    quantity : Nat;
    customNotes : ?Text;
  };

  public type WhatsAppOrder = {
    id : Nat;
    customerPrincipal : Principal.Principal;
    cartItems : [CartItem];
    whatsappNumber : Text;
    status : OrderStatus;
    timestamp : Time.Time;
  };

  public type UserProfile = {
    name : Text;
    phone : ?Text;
    company : ?Text;
  };

  // Persistent state (incremental IDs, products, orders, carts, profiles)
  var productIdCounter : Nat = 0;
  var orderIdCounter : Nat = 0;

  let products = Map.empty<Nat, Product>();
  let orders = Map.empty<Nat, WhatsAppOrder>();
  let customerCarts = Map.empty<Principal, [CartItem]>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Persistent company contact Gmail address
  var companyContactGmail : Text = "gee786110@gmail.com";

  // Persistent custom domain request (stored in canonical form)
  var customDomainRequest : ?Text = null;

  // Add mixin to enable prefabricated authentication system.
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Management ---------------------------

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can retrieve profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product Management --------------------------------

  public query ({ caller }) func getAllProducts() : async [Product] {
    products.values().toArray();
  };

  public query ({ caller }) func getProductsByCategory(category : ProductCategory) : async [Product] {
    products.values().toArray().filter(
      func(product) {
        product.category == category;
      }
    );
  };

  public shared ({ caller }) func addProduct(product : Product) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };

    let newId = productIdCounter;
    productIdCounter += 1;
    let newProduct = { product with id = newId };
    products.add(newId, newProduct);
    newId;
  };

  public shared ({ caller }) func updateProduct(id : Nat, updatedProduct : Product) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };

    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?_) {
        products.add(id, updatedProduct);
      };
    };
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };

    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?_) {
        products.remove(id);
      };
    };
  };

  // Image Handling ------------------------------------

  public shared ({ caller }) func uploadProductImage(productId : Nat, externalBlob : Storage.ExternalBlob) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can upload images");
    };

    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) {
        let updatedProduct = {
          product with
          imageBlob = ?externalBlob;
        };
        products.add(productId, updatedProduct);
      };
    };
  };

  public shared ({ caller }) func deleteProductImage(productId : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete images");
    };

    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) {
        let updatedProduct = {
          product with
          imageBlob = null;
          image = "";
        };
        products.add(productId, updatedProduct);
      };
    };
  };

  // Cart Management -----------------------------------

  public shared ({ caller }) func addToCart(productId : Nat, quantity : Nat, customNotes : ?Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage carts");
    };

    let currentCart = switch (customerCarts.get(caller)) {
      case (null) { [] };
      case (?cart) { cart };
    };

    let newItem : CartItem = {
      productId;
      quantity;
      customNotes;
    };

    let updatedCart = currentCart.concat([newItem]);
    customerCarts.add(caller, updatedCart);
  };

  public shared ({ caller }) func removeFromCart(productId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage carts");
    };

    let currentCart = switch (customerCarts.get(caller)) {
      case (null) { [] };
      case (?cart) { cart };
    };

    let filteredCart = currentCart.filter(
      func(item) {
        item.productId != productId;
      }
    );

    customerCarts.add(caller, filteredCart);
  };

  public query ({ caller }) func getCart() : async [CartItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view carts");
    };

    switch (customerCarts.get(caller)) {
      case (null) { [] };
      case (?cart) { cart };
    };
  };

  // WhatsApp Order Handling ---------------------------

  public shared ({ caller }) func submitWhatsAppOrder(cartItems : [CartItem], whatsappNumber : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit orders");
    };

    let newOrderId = orderIdCounter;
    orderIdCounter += 1;

    let newOrder : WhatsAppOrder = {
      id = newOrderId;
      customerPrincipal = caller;
      cartItems;
      whatsappNumber;
      status = #new;
      timestamp = Time.now();
    };

    orders.add(newOrderId, newOrder);
    newOrderId;
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, status : OrderStatus) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };

    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        let updatedOrder = { order with status };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  public query ({ caller }) func getAllOrders() : async [WhatsAppOrder] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray();
  };

  public query ({ caller }) func getOrder(orderId : Nat) : async ?WhatsAppOrder {
    switch (orders.get(orderId)) {
      case (null) { null };
      case (?order) {
        // Only the customer who placed the order or an admin can view it
        if (order.customerPrincipal == caller or AccessControl.isAdmin(accessControlState, caller)) {
          ?order;
        } else {
          Runtime.trap("Unauthorized: Can only view your own orders");
        };
      };
    };
  };

  public query ({ caller }) func getMyOrders() : async [WhatsAppOrder] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their orders");
    };

    orders.values().toArray().filter(
      func(order) {
        order.customerPrincipal == caller;
      }
    );
  };

  // Utility Functions ---------------------------------

  public query ({ caller }) func checkStock(productId : Nat) : async StockStatus {
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product.stockStatus };
    };
  };

  public query ({ caller }) func filterProductsByStock(status : StockStatus) : async [Product] {
    products.values().toArray().filter(
      func(product) {
        product.stockStatus == status;
      }
    );
  };

  public query ({ caller }) func getProductsBySearch(searchTerm : Text) : async [Product] {
    products.values().toArray().filter(
      func(product) {
        product.name.contains(#text searchTerm) or product.description.contains(#text searchTerm);
      }
    );
  };

  // Persistent Company Contact Gmail Functions ---------

  public shared ({ caller }) func updateCompanyContactGmail(newGmail : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update contact Gmail");
    };
    companyContactGmail := newGmail;
  };

  public query ({ caller }) func getCompanyContactGmail() : async Text {
    companyContactGmail;
  };

  // Persistent Custom Domain Request (canonical form) --

  public shared ({ caller }) func setCustomDomainRequest(domain : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can set custom domain request");
    };
    // Store domain in canonical form
    customDomainRequest := ?domain;
  };

  public query ({ caller }) func getCustomDomainRequest() : async ?Text {
    customDomainRequest;
  };
};
