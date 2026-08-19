---
title: Stripe 支付集成指南
category: jinjie
order: 1
summary: Stripe支付集成全流程：账户注册、沙盒配置、Webhook与上线
---

# Stripe支付集成指南

# 本节将帮助你在项目中集成Stripe支付功能，包括账户设置、基础配置、支付实现以及测试流程。集成流程概述

在开始集成Stripe支付之前，让我们先了解完整的操作流程：

![图](images/01-stripe-p000-x21.webp)

## 前置准备

## 1. 注册香港公司

通过可靠的代办公司进行注册（约1周时间）

费用：注册约5000港币

年度维护费用：4000-5000港币

## 2. 开设香港公司银行账户

可使用空中云汇（Airwallex）

直接注册云汇账号并填写公司信息

注意：新公司可能需要支付开户费用

## Stripe集成步骤

## 1. 创建和验证Stripe账户

注册Stripe账户

完成KYC（个人身份认证）

完成KYB（企业认证）

## 2. 沙盒环境配置

创建测试产品

获取测试支付链接

配置测试环境API密钥

设置测试Webhook

## 3. 技术实现

配置环境变量（API Secret Key）

配置Webhook端点

开发支付功能代码

集成支付链接

## 4. 测试验证

在沙盒模式下测试支付流程

验证Webhook回调

测试错误处理

确认支付流程完整性

## 5. 正式环境部署

替换正式环境API Secret Key

更新正式环境Webhook配置

验证生产环境支付流程

监控支付状态

让我们按照上述步骤，详细了解每个环节的具体实现。

## 1. 创建和配置账户

### 1.1 注册账户

首先，你需要创建一个Stripe账户：

![图](images/01-stripe-p003-x40.webp)

### 1.2 了解支付方式

## 1. 一次性支付功能介绍：

![图](images/01-stripe-p004-x43.webp)

## 2. 设置一次性支付：

![图](images/01-stripe-p005-x46.webp)

## 3. 了解支付链接：

![图](images/01-stripe-p006-x49.webp)

## 2. 创建产品和支付链接

### 2.1 设置产品

## 1. 创建一次性产品：

![图](images/01-stripe-p007-x52.webp)

## 2. 添加产品信息：

![图](images/01-stripe-p008-x55.webp)

![图](images/01-stripe-p009-x58.webp)

### 2.2 配置支付链接

## 1. 创建支付链接：

![图](images/01-stripe-p010-x61.webp)

## 2. 设置支付页面：

![图](images/01-stripe-p011-x64.webp)

## 3. 配置支付后行为：

![图](images/01-stripe-p012-x67.webp)

## 4. 获取支付链接：

![图](images/01-stripe-p013-x70.webp)

## 3. 完善商业信息

### 3.1 验证商业资料

## 1. 验证商业档案：

![图](images/01-stripe-p014-x73.webp)

## 2. 填写商业详情：

![图](images/01-stripe-p015-x76.webp)

## 3. 设置税收计算：

![图](images/01-stripe-p016-x79.webp)

## 4. 提交审核：

![图](images/01-stripe-p017-x82.webp)

### 3.2 沙箱环境配置

## 1. 复制沙箱设置：

![图](images/01-stripe-p018-x85.webp)

## 2. 沙箱配置：

![图](images/01-stripe-p019-x88.webp)

### 3.3 产品管理

## 1. 查看产品目录：

![图](images/01-stripe-p020-x91.webp)

## 2. 分享支付链接：

![图](images/01-stripe-p021-x94.webp)

## 4. API和Webhook配置

### 4.1 API密钥设置

## 1. 获取API密钥：

![图](images/01-stripe-p022-x97.webp)

### 4.2 Webhook配置

## 1. Webhook介绍：

![图](images/01-stripe-p023-x100.webp)

## 2. 本地测试说明：

![图](images/01-stripe-p024-x103.webp)

## 3. 配置本地监听器：

![图](images/01-stripe-p025-x106.webp)

## 4. 监听器配置步骤：

![图](images/01-stripe-p026-x109.webp)

![图](images/01-stripe-p027-x113.webp)

![图](images/01-stripe-p027-x112.webp)

![图](images/01-stripe-p028-x116.webp)

### 4.3 在线支付配置

## 1. 获取在线支付链接：

![图](images/01-stripe-p028-x117.webp)

## 2. 配置Webhook端点：

![图](images/01-stripe-p029-x120.webp)

![图](images/01-stripe-p030-x123.webp)

![图](images/01-stripe-p031-x126.webp)

![图](images/01-stripe-p032-x129.webp)

![图](images/01-stripe-p033-x132.webp)

### 4.4 支付方式和部署

## 1. 启用支付宝和微信支付：

![图](images/01-stripe-p034-x135.webp)

## 2. Vercel环境变量配置：

![图](images/01-stripe-p035-x142.webp)

## 5. 代码实现

## 环境变量配置

STRIPE_WEBHOOK_SECRET=whsec_xxxxx

## 用Cursor写支付功能

![图](images/01-stripe-p036-x145.webp)

![图](images/01-stripe-p037-x148.webp)

## 6. 测试

### 6.1 测试卡号

使用以下测试卡号进行支付测试：

成功支付: 4242 4242 4242 4242

需要认证: 4000 0025 0000 3155

支付失败: 4000 0000 0000 9995

### 6.2 本地Webhook测试

使用Stripe CLI测试Webhook：

# 相关资源

Stripe支付教程视频
