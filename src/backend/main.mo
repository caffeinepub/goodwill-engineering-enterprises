import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
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
    image : Text;
    imageBlob : ?Storage.ExternalBlob;
    description : Text;
    specifications : [(Text, Text)];
    price : ?Nat;
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

  var productIdCounter : Nat = 0;
  var orderIdCounter : Nat = 0;

  let products = Map.empty<Nat, Product>();
  let orders = Map.empty<Nat, WhatsAppOrder>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var companyContactGmail : Text = "gee786110@gmail.com";
  var customDomainRequest : ?Text = null;

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

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

  public shared ({ caller }) func addProducts(newProducts : [Product]) : async [Nat] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };

    var currentId = productIdCounter;
    let createdIds : [Nat] = newProducts.map(
      func(product) {
        let newProduct = { product with id = currentId };
        products.add(currentId, newProduct);
        let idToReturn = currentId;
        currentId += 1;
        idToReturn;
      }
    );

    productIdCounter := currentId;
    createdIds;
  };

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
    let lowerSearchTerm = searchTerm.toLower();
    products.values().toArray().filter(
      func(product) {
        product.name.toLower().contains(#text lowerSearchTerm) or product.description.toLower().contains(#text lowerSearchTerm);
      }
    );
  };

  public shared ({ caller }) func updateCompanyContactGmail(newGmail : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update contact Gmail");
    };
    companyContactGmail := newGmail;
  };

  public query ({ caller }) func getCompanyContactGmail() : async Text {
    companyContactGmail;
  };

  public shared ({ caller }) func setCustomDomainRequest(domain : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can set custom domain request");
    };
    customDomainRequest := ?domain;
  };

  public query ({ caller }) func getCustomDomainRequest() : async ?Text {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view custom domain request");
    };
    customDomainRequest;
  };
};
