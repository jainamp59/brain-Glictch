<?php
header("Content-Type: application/json");
require "db.php";
$data=json_decode(file_get_contents("php://input"),true);
$username=trim($data["username"]??"");
$score=(int)($data["score"]??0);
if($username===""){http_response_code(400);echo json_encode(["message"=>"Username required"]);exit;}
$username=mb_substr($username,0,30);
$score=max(0,min($score,1000000));
$stmt=$pdo->prepare("INSERT INTO leaderboard(username,score) VALUES(?,?)");
$stmt->execute([$username,$score]);
echo json_encode(["message"=>"Score saved successfully!"]);
?>