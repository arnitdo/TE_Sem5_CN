import java.util.Scanner;
public class Charcount{
	public static void main(String []args){
		Scanner sc= new Scanner(System.in);
		System.out.println("Enter first string :");
		String str1=sc.nextLine();
		System.out.println("Enter second string :");
		String str2=sc.nextLine();
		int len1=str1.length()+1;
		int len2=str2.length()+1;
		String result= len1+str1+len2+str2;
		System.out.println("Output : "+result);
		sc.close();
	}
}