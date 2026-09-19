<?php
header("Content-Type: application/json");
require "db.php";
$stmt=$pdo->query("SELECT username,score FROM leaderboard ORDER BY score DESC, created_at ASC LIMIT 20");
echo json_encode($stmt->fetchAll());
?>