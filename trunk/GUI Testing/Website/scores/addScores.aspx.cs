using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using MySql.Data.MySqlClient;
using MySql.Data.Types;

namespace unity1.scores
{
    public partial class addScores : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

            string strName = Request["name"];
            string strScore = Request["score"];

            /* Example at http://www.unifycommunity.com/wiki/index.php?title=Server_Side_Highscores
             * uses hashes and md5 to make sure this is secure. 
             * if using this in a production environment absolutely do that.
             */
                        
            string strCon = "Data Source=localhost;Database=unity1;User Id=root;Password=password;";
            string strSql = "insert into scores values (NULL, '"+ strName +"', '"+ strScore +"');";

            MySqlConnection con = new MySqlConnection(strCon);
            MySqlCommand cmd = new MySqlCommand(strSql, con);

            con.Open();
            cmd.ExecuteNonQuery();

        }
    }
}