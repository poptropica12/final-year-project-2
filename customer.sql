-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2019 年 06 月 04 日 17:02
-- 伺服器版本： 10.1.40-MariaDB
-- PHP 版本： 7.3.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫： `customer`
--

-- --------------------------------------------------------

--
-- 資料表結構 `comment`
--

CREATE TABLE `comment` (
  `cid` int(11) NOT NULL,
  `comments` text,
  `rating` decimal(2,1) NOT NULL,
  `pid` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 傾印資料表的資料 `comment`
--

INSERT INTO `comment` (`cid`, `comments`, `rating`, `pid`, `uid`, `time`) VALUES
(1, 'I love this, haha.', '0.9', 1, 1, '2019-06-01 13:34:09'),
(2, 'I love this, haha', '4.5', 1, 3, '2019-06-01 13:34:09'),
(3, 'I hate green :(', '0.5', 3, 4, '2019-06-01 13:34:09'),
(4, 'I love this.', '5.0', 3, 4, '2019-06-03 07:14:39');

-- --------------------------------------------------------

--
-- 資料表結構 `product`
--

CREATE TABLE `product` (
  `pid` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `cost` decimal(10,2) NOT NULL DEFAULT '0.00',
  `image` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 傾印資料表的資料 `product`
--

INSERT INTO `product` (`pid`, `name`, `price`, `cost`, `image`) VALUES
(1, 'orange', '6.50', '5.00', 'orange-2850848_1280.png'),
(2, 'banana', '7.00', '4.00', 'banana-bananas-colorful-2014461.jpg'),
(3, 'apple', '5.40', '5.00', 'apple-food-fresh-38068.jpg'),
(4, 'grapes', '10.70', '6.00', 'grape-3882144_1280.jpg');

-- --------------------------------------------------------

--
-- 資料表結構 `sales`
--

CREATE TABLE `sales` (
  `cid` int(11) NOT NULL,
  `qty` int(11) NOT NULL DEFAULT '1',
  `pid` int(11) NOT NULL,
  `date` date NOT NULL,
  `uid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 傾印資料表的資料 `sales`
--

INSERT INTO `sales` (`cid`, `qty`, `pid`, `date`, `uid`) VALUES
(1, 1, 1, '2019-05-31', 4),
(2, 5, 3, '2019-05-22', 3),
(3, 10, 1, '2019-05-21', 3),
(4, 3, 1, '2019-04-23', 2),
(5, 1, 4, '2012-12-12', 4),
(6, 1, 4, '2012-12-12', 4),
(7, 6, 3, '2019-06-12', 2),
(8, 3, 3, '2019-06-14', 2),
(9, 50, 2, '2019-06-12', 2),
(10, 4, 3, '2019-06-19', 4),
(11, 1, 2, '2019-06-03', 5),
(12, 12, 3, '2019-05-27', 4),
(13, 4, 3, '2019-06-02', 1),
(14, 1, 1, '2019-12-12', 4);

-- --------------------------------------------------------

--
-- 資料表結構 `user`
--

CREATE TABLE `user` (
  `uid` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `type` enum('admin','normal') NOT NULL DEFAULT 'normal'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 傾印資料表的資料 `user`
--

INSERT INTO `user` (`uid`, `username`, `password`, `type`) VALUES
(1, 'admin@admin.com', 'admin', 'admin'),
(2, 'enoch@enoch.com', 'enoch', 'normal'),
(3, 'a@a.com', 'aaa', 'normal'),
(4, 'k@k.com', '123', 'normal'),
(5, 'k@k1.com', '123', 'normal'),
(6, '123@ad.com', '123', 'normal');

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `comment`
--
ALTER TABLE `comment`
  ADD PRIMARY KEY (`cid`);

--
-- 資料表索引 `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`pid`);

--
-- 資料表索引 `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`cid`);

--
-- 資料表索引 `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`uid`);

--
-- 在傾印的資料表使用自動增長(AUTO_INCREMENT)
--

--
-- 使用資料表自動增長(AUTO_INCREMENT) `comment`
--
ALTER TABLE `comment`
  MODIFY `cid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- 使用資料表自動增長(AUTO_INCREMENT) `product`
--
ALTER TABLE `product`
  MODIFY `pid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- 使用資料表自動增長(AUTO_INCREMENT) `sales`
--
ALTER TABLE `sales`
  MODIFY `cid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- 使用資料表自動增長(AUTO_INCREMENT) `user`
--
ALTER TABLE `user`
  MODIFY `uid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
