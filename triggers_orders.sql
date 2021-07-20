
DELIMITER ;;
CREATE TRIGGER `orders_date` BEFORE INSERT ON `orders` FOR EACH ROW
BEGIN
IF (NEW.date is null) THEN
    SET NEW.date = current_date;
END IF;
END;;
DELIMITER ;

DELIMITER ;;
CREATE TRIGGER `orders_time` BEFORE INSERT ON `orders` FOR EACH ROW
BEGIN
IF (NEW.time is null) THEN
    SET NEW.time = current_time;
END IF;
END;;
DELIMITER ;