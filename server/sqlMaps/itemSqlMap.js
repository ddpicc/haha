var sqlMap = {
  //添加一条物品模板信息
  insertItemTemplate: 'INSERT INTO littleAnt_item_template(barcode,type,item_name,price,brand) VALUES(?,?,?,?,?)',
	//添加一条物品信息，物品对应的thirdPartyPackage,模板id,数量信息
	insertPackageItem: 'INSERT INTO littleAnt_minimalGroupItems_in_package(third_party_packageId,itemTemplate_Id,item_count) VALUES(?,?,?)',
	//删除一条物品信息
	deletePackageItem: 'DELETE FROM littleAnt_minimalGroupItems_in_package WHERE id=?',
	//通过thirdPartyPackge id 获取包裹内物品，物品是没有对应的package id，意思是还没有被发出，存在与仓库中
	getItemsByThirdPartyPackageId: 'SELECT a.*,b.barcode,b.type,b.item_name,b.price,b.brand FROM littleAnt_minimalGroupItems_in_package a INNER JOIN littleAnt_item_template b on a.itemTemplate_Id = b.id WHERE a.third_party_packageId = ? AND a.package_Id IS NULL',
	//是否有同样UPC码的物品信息
	existItemByUPC: 'SELECT * FROM littleAnt_item_template WHERE barcode = ? limit 1',
	//用户发货时更新物品对应的包裹编号
	updateItemSetPackageId: 'UPDATE littleAnt_minimalGroupItems_in_package SET package_Id = ? WHERE id = ?',

	//用在事务里
	//更新物品数量，用户发货时发走的数量
	updateItemCount: 'UPDATE littleAnt_minimalGroupItems_in_package SET item_count = item_count + ? WHERE id = ?',
	//复制一条完整的物品信息，填入package id，物品信息包含图片，当用户发货时分拆了包裹，复制一条新的物品信息，填入原始物品id
	copyOneItem: 'INSERT INTO littleAnt_minimalGroupItems_in_package(third_party_packageId,package_Id,itemTemplate_Id,item_count,pic1_url,pic1_name,pic2_url,pic2_name,pic3_url,pic3_name,origiral_item_Id) VALUES(?,?,?,?,?,?,?,?,?,?,?)',

	//根据package id获取包裹内物品，使用在发货时，用户已经创建了小蚂蚁单号
	getItemsByPackageId: 'SELECT a.*,b.barcode,b.type,b.item_name,b.price,b.brand FROM littleAnt_minimalGroupItems_in_package a INNER JOIN littleAnt_item_template b on a.itemTemplate_Id = b.id WHERE a.package_ID = ?',

	//更新物品的子单号和子单号里面包含的数量，使用于管理员打包处理时
	updateReportItemWithChildOrder: 'UPDATE littleAnt_minimalGroupItems_in_package SET childPackage_Id = ?, item_count = ? WHERE id = ?',
	//复制一条物品信息，填入子单号,信息不再复制图片,没有第三方包裹id
  copyItemInsertChildPackageId: 'INSERT INTO littleAnt_minimalGroupItems_in_package(package_id,childPackage_Id,itemTemplate_Id,item_count) VALUES(?,?,?,?)',
	//获取所有物品模板
	getAllItemTemplate: 'SELECT * FROM littleAnt_item_template',
	//删除一条物品模板
	deleteItemTemplate: 'DELETE FROM littleAnt_item_template WHERE id = ?',
	//更新一条物品模板信息
	updateItemTemplate: 'UPDATE littleAnt_item_template SET type = ?, item_name = ?, price = ?, brand = ? WHERE id = ?',
}
  
module.exports = sqlMap;