<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = 'mysql';
$dbname = 'itl1_db';
$username = 'itl1_user';
$password = 'itl1_password';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Simple routing
switch (true) {
    case $uri === '/items' && $method === 'GET':
        // Get all items
        $stmt = $pdo->query("SELECT * FROM items ORDER BY id");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;

    case $uri === '/items' && $method === 'POST':
        // Create item
        $data = json_decode(file_get_contents('php://input'), true);
        if (!isset($data['name'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Name is required']);
            break;
        }
        $stmt = $pdo->prepare("INSERT INTO items (name) VALUES (?)");
        $stmt->execute([$data['name']]);
        echo json_encode(['id' => $pdo->lastInsertId(), 'name' => $data['name']]);
        break;

    case preg_match('/^\/items\/(\d+)$/', $uri, $matches) && $method === 'DELETE':
        // Delete item
        $id = $matches[1];
        $stmt = $pdo->prepare("DELETE FROM items WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true]);
        break;

    case $uri === '/health' || $uri === '/':
        echo json_encode(['status' => 'ok', 'database' => 'connected']);
        break;

    default:
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint not found']);
}
